import Controllers from "@/controllers";
import {
  systemAdminMaintainerAccessMiddleware,
  systemAdminRootAccessMiddleware,
  systemAdminSuperRootAccessMiddleware,
} from "@/middlewares/userRolesMiddleware";
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
  systemAdminMaintainerAccessMiddleware,
  validateRequest(Validators.SystemAdmin.createNotificationPlan),
  Controllers.SystemAdmin.createNotificationPlan
);

systemAdminRouter.put(
  "/notification/inventory",
  systemAdminRootAccessMiddleware,
  validateRequest(Validators.SystemAdmin.updateSystemInventoryLimits),
  Controllers.SystemAdmin.updateSystemInventoryLimits
);

systemAdminRouter.post(
  "/notification/inventory",
  systemAdminRootAccessMiddleware,
  validateRequest(Validators.SystemAdmin.addCreditsIntoSystemInventory),
  Controllers.SystemAdmin.addCreditsIntoSystemInventory
);

systemAdminRouter.get(
  "/notification/inventory",
  Controllers.SystemAdmin.getSystemInventory
);

systemAdminRouter.post(
  "/notification/limit",
  systemAdminRootAccessMiddleware,
  validateRequest(Validators.SystemAdmin.notifChannelUsageLimit),
  Controllers.SystemAdmin.notifChannelUsageLimit
);

systemAdminRouter.put(
  "/notification/limit",
  systemAdminRootAccessMiddleware,
  validateRequest(Validators.SystemAdmin.notifChannelUsageLimit),
  Controllers.SystemAdmin.notifChannelLimitUpdate
);

systemAdminRouter.get(
  "/notification/limit",
  Controllers.SystemAdmin.getNotifChannelUsageLimit
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
  systemAdminRootAccessMiddleware,
  validateRequest(Validators.SystemAdmin.purchaseNotificationPlanBySystemAdmin),
  Controllers.SystemAdmin.purchasePlanForSchool
);

systemAdminRouter.post(
  "/user",
  systemAdminSuperRootAccessMiddleware,
  validateRequest(Validators.SystemAdmin.createNewSystemAdminUser),
  Controllers.SystemAdmin.createNewSystemAdminUser
);

export default systemAdminRouter;
