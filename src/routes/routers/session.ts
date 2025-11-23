import express from "express";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";
import { adminMiddleware } from "../../middlewares/userRolesMiddleware";

const sessionRouter = express.Router();

sessionRouter.post(
  "/",
  adminMiddleware,
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
  adminMiddleware,
  validateRequest(Validators.Session.updateSessionState),
  Controllers.Session.changeSessionStatus
);

export default sessionRouter;
