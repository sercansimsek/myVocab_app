import { z } from "zod";

export const createWordSchema = z.object({
  english: z.string().trim().min(1).max(255),
  turkish: z.string().trim().min(1).max(255),
  slovak: z.string().trim().min(1).max(255),
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => value || undefined),
});

export type CreateWordInput = z.infer<typeof createWordSchema>;
