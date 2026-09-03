import { createHash, randomBytes } from "node:crypto";
import { REFRESH_TOKEN_TTL_MS } from "../config/auth.js";

export const createRefreshToken = (): string => {
  return randomBytes(48).toString("base64url");
};

export const hashRefreshToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const createRefreshTokenExpiration = (): Date => {
  return new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
};
