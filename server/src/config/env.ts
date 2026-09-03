import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

if (!jwtAccessSecret || jwtAccessSecret.length < 32) {
  throw new Error("JWT_ACCESS_SECRET must contain at least 32 characters");
}

const nodeEnv = process.env.NODE_ENV ?? "development";

if (!["development", "test", "production"].includes(nodeEnv)) {
  throw new Error("NODE_ENV is invalid");
}

export const env = {
  databaseUrl,
  jwtAccessSecret,
  nodeEnv,
};
