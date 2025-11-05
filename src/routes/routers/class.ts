import express from "express";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";

const classRouter = express.Router();

classRouter.post(
  "/",
  validateRequest(Validators.Class.create),
  Controllers.Class.create
);
classRouter.get("/", Controllers.Class.getAll);

export default classRouter;
