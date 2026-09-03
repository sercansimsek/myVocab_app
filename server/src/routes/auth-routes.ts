import { authenticate } from "../middleware/authenticate.js";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth-controller.js";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, me);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
