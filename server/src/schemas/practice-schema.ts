import { z } from "zod";

export const practiceWordsQuerySchema = z.object({
  target: z.enum(["turkish", "slovak"]),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export type PracticeWordsQueryInput = z.infer<typeof practiceWordsQuerySchema>;
