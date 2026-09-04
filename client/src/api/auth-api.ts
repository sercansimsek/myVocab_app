import { apiClient, refreshAccessToken } from "./api-client";
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

export const refreshRequest = async (): Promise<AccessTokenResult> => {
  const accessToken = await refreshAccessToken();

  return { accessToken };
};

export const getCurrentUserRequest = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");

  return response.data.data.user;
};

export const logoutRequest = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
