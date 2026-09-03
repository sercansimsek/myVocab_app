import { authenticate } from "../middleware/authenticate.js";
import { login, me, register } from "../controllers/auth-controller.js";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, me);
