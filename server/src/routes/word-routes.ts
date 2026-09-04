import { Router } from "express";
import { create } from "../controllers/word-controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const wordRouter = Router();

wordRouter.use(authenticate);

wordRouter.post("/", create);
