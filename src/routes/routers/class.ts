import express from "express";
import Controllers from "@/controllers";
import { validateRequest } from "@/middlewares/zodMiddleware";
import Validators from "@/validators";
import { adminMiddleware } from "@/middlewares/userRolesMiddleware";

const classRouter = express.Router();

classRouter.post(
  "/",
  validateRequest(Validators.Class.create),
  adminMiddleware,
  Controllers.Class.create
);
classRouter.get("/", Controllers.Class.getAll);

export default classRouter;
