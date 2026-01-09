import express from "express";
import Controllers from "@/controllers";
import { validateRequest } from "@/middlewares/zodMiddleware";
import Validators from "@/validators";
import { adminMiddleware } from "@/middlewares/userRolesMiddleware";

const sessionRouter = express.Router();

sessionRouter.post(
  "/",
  validateRequest(Validators.Session.create),
  adminMiddleware,
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
  adminMiddleware,
  Controllers.Session.changeSessionStatus
);

export default sessionRouter;
