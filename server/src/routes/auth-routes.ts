import { authenticate } from "../middleware/authenticate.js";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth-controller.js";
import { noStore } from "../middleware/no-store.js";
import { Router } from "express";

export const authRouter = Router();

authRouter.use(noStore);

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, me);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
