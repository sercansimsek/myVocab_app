import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import { authRouter } from "./routes/auth-routes.js";
import { env } from "./config/env.js";

import { notFoundHandler } from "./middleware/not-found-handler.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    message: "myVocab API is running",
  });
});

app.use("/api/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);
