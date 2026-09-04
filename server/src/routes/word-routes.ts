import { Router } from "express";
import {
  create,
  list,
  getById,
  update,
  remove,
} from "../controllers/word-controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { noStore } from "../middleware/no-store.js";

export const wordRouter = Router();

wordRouter.use(noStore);
wordRouter.use(authenticate);

wordRouter.get("/", list);
wordRouter.get("/:id", getById);
wordRouter.post("/", create);
wordRouter.patch("/:id", update);
wordRouter.delete("/:id", remove);
