import { SignJWT } from "jose";
import { env } from "../config/env.js";

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
