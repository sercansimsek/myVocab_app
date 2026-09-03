import type { RequestHandler } from "express";
import { registerSchema, loginSchema } from "../schemas/auth-schema.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshLoginSession,
  logoutUser,
} from "../services/auth-service.js";
import { AppError } from "../utils/app-error.js";
import {
  REFRESH_TOKEN_COOKIE_NAME,
  refreshTokenClearCookieOptions,
  refreshTokenCookieOptions,
} from "../config/auth.js";

export const register: RequestHandler = async (request, response) => {
  const result = registerSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid registration data",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });

    return;
  }

  const user = await registerUser(result.data);

  response.status(201).json({
    data: {
      user,
    },
  });
};

export const login: RequestHandler = async (request, response) => {
  const result = loginSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid login data",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });

    return;
  }

  const { refreshToken, ...authResult } = await loginUser(result.data);

  response.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    refreshTokenCookieOptions,
  );

  response.status(200).json({
    data: authResult,
  });
};

export const me: RequestHandler = async (request, response) => {
  if (!request.userId) {
    throw new AppError(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authentication is required",
    );
  }

  const user = await getCurrentUser(request.userId);

  response.status(200).json({
    data: {
      user,
    },
  });
};

export const refresh: RequestHandler = async (request, response) => {
  const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  if (typeof refreshToken !== "string") {
    throw new AppError(
      401,
      "REFRESH_TOKEN_REQUIRED",
      "Refresh token is required",
    );
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshLoginSession(refreshToken);

  response.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    newRefreshToken,
    refreshTokenCookieOptions,
  );

  response.status(200).json({
    data: {
      accessToken,
    },
  });
};

export const logout: RequestHandler = async (request, response) => {
  const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  if (typeof refreshToken === "string") {
    await logoutUser(refreshToken);
  }

  response.clearCookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshTokenClearCookieOptions,
  );

  response.status(204).send();
};
