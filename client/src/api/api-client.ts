import axios, { type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

interface RefreshResponse {
  data: {
    accessToken: string;
  };
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type AuthenticationFailureHandler = () => void;

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;
let authenticationFailureHandler: AuthenticationFailureHandler | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const setAuthenticationFailureHandler = (
  handler: AuthenticationFailureHandler | null,
): void => {
  authenticationFailureHandler = handler;
};

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshResponse>("/auth/refresh")
      .then((response) => {
        const newAccessToken = response.data.data.accessToken;

        setAccessToken(newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

const nonRetryableAuthPaths = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const isNonRetryableAuthRequest = nonRetryableAuthPaths.some((path) =>
      originalRequest?.url?.startsWith(path),
    );

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isNonRetryableAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      authenticationFailureHandler?.();

      return Promise.reject(refreshError);
    }
  },
);
