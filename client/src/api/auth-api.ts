import { apiClient } from "./api-client";
import type {
  AccessTokenResult,
  ApiResponse,
  AuthResult,
  LoginInput,
  RegisterInput,
  User,
} from "../types/auth";

export const loginRequest = async (input: LoginInput): Promise<AuthResult> => {
  const response = await apiClient.post<ApiResponse<AuthResult>>(
    "/auth/login",
    input,
  );

  return response.data.data;
};

export const registerRequest = async (input: RegisterInput): Promise<User> => {
  const response = await apiClient.post<ApiResponse<{ user: User }>>(
    "/auth/register",
    input,
  );

  return response.data.data.user;
};

let refreshPromise: Promise<AccessTokenResult> | null = null;

export const refreshRequest = (): Promise<AccessTokenResult> => {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post<ApiResponse<AccessTokenResult>>("/auth/refresh")
      .then((response) => response.data.data)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const getCurrentUserRequest = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");

  return response.data.data.user;
};

export const logoutRequest = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
