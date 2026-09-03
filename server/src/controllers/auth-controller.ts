import type { RequestHandler } from "express";
import { registerSchema } from "../schemas/auth-schema.js";
import { registerUser } from "../services/auth-service.js";

export const register: RequestHandler = async (request, response) => {
  const result = registerSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid registration data",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });

    return;
  }

  const user = await registerUser(result.data);

  response.status(201).json({
    data: {
      user,
    },
  });
};
