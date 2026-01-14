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

systemAdminRouter.get("/school", Controllers.SystemAdmin.getAllSchoolList);

systemAdminRouter.post(
  "/notification/plan",
  validateRequest(Validators.SystemAdmin.createNotificationPlan),
  Controllers.SystemAdmin.createNotificationPlan
);

systemAdminRouter.post(
  "/notification/inventory",
  validateRequest(Validators.SystemAdmin.addCreditsIntoSystemInventory),
  Controllers.SystemAdmin.addCreditsIntoSystemInventory
);

systemAdminRouter.get(
  "/notification/inventory",
  Controllers.SystemAdmin.getSystemInventory
);

systemAdminRouter.get(
  "/notification/ledger",
  validateRequest(Validators.Notification.getLedgerInfo),
  Controllers.SystemAdmin.getSystemNotificationLedger
);

systemAdminRouter.get(
  "/notification/plan",
  Controllers.SystemAdmin.getAllNotificationPlan
);

systemAdminRouter.post(
  "/notification/plan/purchase",
  validateRequest(Validators.SystemAdmin.purchaseNotificationPlanBySystemAdmin),
  Controllers.SystemAdmin.purchasePlanForSchool
);

export default systemAdminRouter;
