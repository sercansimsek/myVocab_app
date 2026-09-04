import type { RequestHandler } from "express";
import { practiceWordsQuerySchema } from "../schemas/practice-schema.js";
import { getPracticeWords } from "../services/practice-service.js";
import { AppError } from "../utils/app-error.js";

export const listPracticeWords: RequestHandler = async (request, response) => {
  const queryResult = practiceWordsQuerySchema.safeParse(request.query);

  if (!queryResult.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid practice query",
        details: queryResult.error.issues.map((issue) => ({
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

  const result = await getPracticeWords(request.userId, queryResult.data);

  response.status(200).json({
    data: result,
  });
};
