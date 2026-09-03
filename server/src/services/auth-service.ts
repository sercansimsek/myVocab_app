import bcrypt from "bcrypt";
import { prisma } from "../config/database.js";
import type { RegisterInput } from "../schemas/auth-schema.js";
import { AppError } from "../utils/app-error.js";

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
