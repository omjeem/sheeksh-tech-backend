import express from "express";
import Controllers from "@/controllers";
import { validateRequest } from "@/middlewares/zodMiddleware";
import Validators from "@/validators";

const authRouter = express.Router();

authRouter.post(
  "/login",
  validateRequest(Validators.Auth.login),
  Controllers.Auth.login
);

export default authRouter;
