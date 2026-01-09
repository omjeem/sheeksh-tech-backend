import express from "express";
import Controllers from "@/controllers";
import { validateRequest } from "@/middlewares/zodMiddleware";
import Validators from "@/validators";
import { adminMiddleware } from "@/middlewares/userRolesMiddleware";

const subjectRouter = express.Router();

subjectRouter.post(
  "/",
  validateRequest(Validators.Subject.create),
  adminMiddleware,
  Controllers.Subject.create
);
subjectRouter.get("/", Controllers.Subject.get);

export default subjectRouter;
