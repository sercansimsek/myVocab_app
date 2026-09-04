import { Router } from "express";
import { listPracticeWords } from "../controllers/practice-controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { noStore } from "../middleware/no-store.js";

export const practiceRouter = Router();

practiceRouter.use(noStore);
practiceRouter.use(authenticate);

practiceRouter.get("/words", listPracticeWords);
