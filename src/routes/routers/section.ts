import express from "express";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";
import { adminMiddleware } from "../../middlewares/userRolesMiddleware";

const sectionRouter = express.Router();

sectionRouter.post(
  "/",
  validateRequest(Validators.Section.create),
  adminMiddleware,
  Controllers.Section.create
);
sectionRouter.get("/:classId", Controllers.Section.getAll);

export default sectionRouter;
