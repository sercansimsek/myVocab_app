import { env } from "../config/env.js";
import { jwtVerify, SignJWT } from "jose";
import { AppError } from "./app-error.js";

const accessSecret = new TextEncoder().encode(env.jwtAccessSecret);

export const createAccessToken = async (userId: string): Promise<string> => {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuer("myvocab-api")
    .setAudience("myvocab-client")
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret);
};

export const verifyAccessToken = async (token: string): Promise<string> => {
  try {
    const { payload } = await jwtVerify(token, accessSecret, {
      issuer: "myvocab-api",
      audience: "myvocab-client",
    });

    if (!payload.sub) {
      throw new Error("Token subject is missing");
    }

    return payload.sub;
  } catch {
    throw new AppError(
      401,
      "INVALID_ACCESS_TOKEN",
      "Access token is invalid or expired",
    );
  }
};
