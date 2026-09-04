import { prisma } from "../config/database.js";
import type {
  CreateWordInput,
  UpdateWordInput,
} from "../schemas/word-schema.js";

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

export const getWordById = async (userId: string, wordId: string) => {
  return prisma.word.findFirst({
    where: {
      id: wordId,
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

export const updateWord = async (
  userId: string,
  wordId: string,
  input: UpdateWordInput,
) => {
  const updateResult = await prisma.word.updateMany({
    where: {
      id: wordId,
      userId,
    },
    data: {
      english: input.english,
      turkish: input.turkish,
      slovak: input.slovak,
      notes: input.notes,
    },
  });

  if (updateResult.count === 0) {
    return null;
  }

  return getWordById(userId, wordId);
};

export const deleteWord = async (
  userId: string,
  wordId: string,
): Promise<boolean> => {
  const deleteResult = await prisma.word.deleteMany({
    where: {
      id: wordId,
      userId,
    },
  });

  return deleteResult.count === 1;
};
