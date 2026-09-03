export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
}

export interface AccessTokenResult {
  accessToken: string;
}

export interface ApiResponse<T> {
  data: T;
}
