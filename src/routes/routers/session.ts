import express from "express";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";

const sessionRouter = express.Router();

sessionRouter.post(
  "/",
  validateRequest(Validators.Session.create),
  Controllers.Session.create
);
sessionRouter.get("/", Controllers.Session.getAll);

export default sessionRouter;
