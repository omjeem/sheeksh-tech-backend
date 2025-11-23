import express from "express";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";
import { adminMiddleware } from "../../middlewares/userRolesMiddleware";

const classRouter = express.Router();

classRouter.post(
  "/",
  adminMiddleware,
  validateRequest(Validators.Class.create),
  Controllers.Class.create
);
classRouter.get("/", Controllers.Class.getAll);

export default classRouter;
