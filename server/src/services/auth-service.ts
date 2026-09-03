import bcrypt from "bcrypt";
import { prisma } from "../config/database.js";

import type { RegisterInput, LoginInput } from "../schemas/auth-schema.js";
import { AppError } from "../utils/app-error.js";
import { createAccessToken } from "../utils/jwt.js";
import {
  createRefreshToken,
  createRefreshTokenExpiration,
  hashRefreshToken,
} from "../utils/refresh-token.js";

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new AppError(
      409,
      "EMAIL_ALREADY_EXISTS",
      "An account with this email already exists",
    );
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Email or password is incorrect",
    );
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Email or password is incorrect",
    );
  }

  const accessToken = await createAccessToken(user.id);
  const refreshToken = createRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const expiresAt = createRefreshTokenExpiration();

  await prisma.refreshSession.create({
    data: {
      tokenHash,
      expiresAt,
      userId: user.id,
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(
      401,
      "INVALID_ACCESS_TOKEN",
      "Access token is invalid or expired",
    );
  }

  return user;
};

export const refreshLoginSession = async (refreshToken: string) => {
  const tokenHash = hashRefreshToken(refreshToken);

  const session = await prisma.refreshSession.findUnique({
    where: {
      tokenHash,
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      revokedAt: true,
    },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    throw new AppError(
      401,
      "INVALID_REFRESH_TOKEN",
      "Refresh token is invalid or expired",
    );
  }

  const newRefreshToken = createRefreshToken();
  const newTokenHash = hashRefreshToken(newRefreshToken);
  const newExpiresAt = createRefreshTokenExpiration();

  await prisma.$transaction(async (transaction) => {
    const updateResult = await transaction.refreshSession.updateMany({
      where: {
        id: session.id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    // Protects against two requests trying to reuse the same token.
    if (updateResult.count !== 1) {
      throw new AppError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Refresh token is invalid or expired",
      );
    }

    await transaction.refreshSession.create({
      data: {
        tokenHash: newTokenHash,
        userId: session.userId,
        expiresAt: newExpiresAt,
      },
    });
  });

  const accessToken = await createAccessToken(session.userId);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  const tokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshSession.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};
