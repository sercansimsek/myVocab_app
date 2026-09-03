import type { RequestHandler } from "express";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate: RequestHandler = async (
  request,
  _response,
  next,
) => {
  const authorization = request.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    throw new AppError(
      401,
      "AUTHENTICATION_REQUIRED",
      "A valid access token is required",
    );
  }

  request.userId = await verifyAccessToken(token);
  next();
};
