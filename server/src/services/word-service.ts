import { prisma } from "../config/database.js";
import type { Prisma } from "../generated/prisma/client.js";
import type {
  CreateWordInput,
  ListWordsQueryInput,
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

export const listWords = async (userId: string, input: ListWordsQueryInput) => {
  const where: Prisma.WordWhereInput = {
    userId,
    ...(input.search
      ? {
          OR: [
            {
              english: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              turkish: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              slovak: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              notes: {
                contains: input.search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const skip = (input.page - 1) * input.limit;

  const [words, totalItems] = await prisma.$transaction([
    prisma.word.findMany({
      where,
      skip,
      take: input.limit,
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
    }),
    prisma.word.count({ where }),
  ]);

  return {
    words,
    pagination: {
      page: input.page,
      limit: input.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / input.limit),
    },
  };
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
