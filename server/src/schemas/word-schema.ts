import { z } from "zod";
export const wordIdSchema = z.uuid();
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

export const updateWordSchema = z
  .object({
    english: z.string().trim().min(1).max(255).optional(),
    turkish: z.string().trim().min(1).max(255).optional(),
    slovak: z.string().trim().min(1).max(255).optional(),
    notes: z
      .string()
      .trim()
      .max(2000)
      .optional()
      .transform((value) => {
        if (value === "") {
          return null;
        }

        return value;
      }),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field is required",
  });

export type UpdateWordInput = z.infer<typeof updateWordSchema>;
