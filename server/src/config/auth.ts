import type { CookieOptions } from "express";
import { env } from "./env.js";

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: REFRESH_TOKEN_TTL_MS,
};
