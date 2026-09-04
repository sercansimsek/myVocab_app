import { prisma } from "../config/database.js";
import type { PracticeWordsQueryInput } from "../schemas/practice-schema.js";

interface PracticeWordRow {
  id: string;
  english: string;
  turkish: string;
  slovak: string;
}

export const getPracticeWords = async (
  userId: string,
  input: PracticeWordsQueryInput,
) => {
  const rows = await prisma.$queryRaw<PracticeWordRow[]>`
    SELECT
      id,
      english,
      turkish,
      slovak
    FROM words
    WHERE user_id = ${userId}::uuid
    ORDER BY RANDOM()
    LIMIT ${input.limit}
  `;

  return {
    target: input.target,
    words: rows.map((row) => ({
      id: row.id,
      english: row.english,
      answer: input.target === "turkish" ? row.turkish : row.slovak,
    })),
  };
};
