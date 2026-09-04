import type { RequestHandler } from "express";
import {
  createWordSchema,
  wordIdSchema,
  updateWordSchema,
} from "../schemas/word-schema.js";
import {
  createWord,
  listWords,
  getWordById,
  updateWord,
} from "../services/word-service.js";
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

export const getById: RequestHandler = async (request, response) => {
  const idResult = wordIdSchema.safeParse(request.params.id);

  if (!idResult.success) {
    throw new AppError(400, "INVALID_WORD_ID", "Word ID must be a valid UUID");
  }

  if (!request.userId) {
    throw new AppError(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authentication is required",
    );
  }

  const word = await getWordById(request.userId, idResult.data);

  if (!word) {
    throw new AppError(404, "WORD_NOT_FOUND", "Word was not found");
  }

  response.status(200).json({
    data: {
      word,
    },
  });
};

export const update: RequestHandler = async (request, response) => {
  const idResult = wordIdSchema.safeParse(request.params.id);

  if (!idResult.success) {
    throw new AppError(400, "INVALID_WORD_ID", "Word ID must be a valid UUID");
  }

  const bodyResult = updateWordSchema.safeParse(request.body);

  if (!bodyResult.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid word data",
        details: bodyResult.error.issues.map((issue) => ({
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

  const word = await updateWord(request.userId, idResult.data, bodyResult.data);

  if (!word) {
    throw new AppError(404, "WORD_NOT_FOUND", "Word was not found");
  }

  response.status(200).json({
    data: {
      word,
    },
  });
};
