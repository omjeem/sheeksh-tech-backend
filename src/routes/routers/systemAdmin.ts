import Controllers from "@/controllers";
import { validateRequest } from "@/middlewares/zodMiddleware";
import Validators from "@/validators";
import express from "express";

const systemAdminRouter = express.Router();

systemAdminRouter.put(
  "/profile",
  validateRequest(Validators.SystemAdmin.profileUpdate),
  Controllers.SystemAdmin.updatePassword
);

systemAdminRouter.post(
  "/notification/plan",
  validateRequest(Validators.SystemAdmin.createNotificationPlan),
  Controllers.SystemAdmin.createNotificationPlan
);

systemAdminRouter.get(
  "/notification/plan",
  Controllers.SystemAdmin.getAllNotificationPlan
);

export default systemAdminRouter;
