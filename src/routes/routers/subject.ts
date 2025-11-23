import express from "express";
import { subjectRelations } from "../../config/schema";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";
import { adminMiddleware } from "../../middlewares/userRolesMiddleware";

const subjectRouter = express.Router();

subjectRouter.post(
  "/",
  adminMiddleware,
  validateRequest(Validators.Subject.create),
  Controllers.Subject.create
);
subjectRouter.get("/", Controllers.Subject.get);

export default subjectRouter;
