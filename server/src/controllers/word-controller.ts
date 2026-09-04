import type { RequestHandler } from "express";
import { createWordSchema } from "../schemas/word-schema.js";
import { createWord, listWords } from "../services/word-service.js";
import { AppError } from "../utils/app-error.js";

export const create: RequestHandler = async (request, response) => {
  const result = createWordSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid word data",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });

    return;
  }

  if (!request.userId) {
    throw new AppError(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authentication is required",
    );
  }

  const word = await createWord(request.userId, result.data);

  response.status(201).json({
    data: {
      word,
    },
  });
};

export const list: RequestHandler = async (request, response) => {
  if (!request.userId) {
    throw new AppError(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authentication is required",
    );
  }

  const words = await listWords(request.userId);

  response.status(200).json({
    data: {
      words,
    },
  });
};
