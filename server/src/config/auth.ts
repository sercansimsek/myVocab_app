import type { CookieOptions } from "express";
import { env } from "./env.js";

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const refreshTokenCookieBaseOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  path: "/api/auth",
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...refreshTokenCookieBaseOptions,
  maxAge: REFRESH_TOKEN_TTL_MS,
};

export const refreshTokenClearCookieOptions: CookieOptions =
  refreshTokenCookieBaseOptions;
