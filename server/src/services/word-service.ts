import { prisma } from "../config/database.js";
import type { CreateWordInput } from "../schemas/word-schema.js";

export const createWord = async (userId: string, input: CreateWordInput) => {
  return prisma.word.create({
    data: {
      english: input.english,
      turkish: input.turkish,
      slovak: input.slovak,
      notes: input.notes ?? null,
      userId,
    },
    select: {
      id: true,
      english: true,
      turkish: true,
      slovak: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const listWords = async (userId: string) => {
  return prisma.word.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      english: true,
      turkish: true,
      slovak: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
