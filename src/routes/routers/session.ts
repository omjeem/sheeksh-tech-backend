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
sessionRouter.get(
  "/",
  validateRequest(Validators.Session.getSessions),
  Controllers.Session.getAll
);
sessionRouter.put(
  "/",
  validateRequest(Validators.Session.updateSessionState),
  Controllers.Session.changeSessionStatus
);

export default sessionRouter;
