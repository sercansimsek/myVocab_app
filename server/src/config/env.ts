import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

if (!jwtAccessSecret || jwtAccessSecret.length < 32) {
  throw new Error("JWT_ACCESS_SECRET must contain at least 32 characters");
}

export const env = {
  databaseUrl,
  jwtAccessSecret,
};
