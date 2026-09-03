import cors from "cors";
import express from "express";

import { authRouter } from "./routes/auth-routes.js";

import { notFoundHandler } from "./middleware/not-found-handler.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    message: "myVocab API is running",
  });
});

app.use("/api/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);
