import express from "express";
import { adminMiddleware } from "../../middlewares/userRolesMiddleware";
import { authMiddleware } from "../../middlewares/authMiddleware";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";

const notificationRouter = express.Router();
notificationRouter.use(authMiddleware);

notificationRouter.get(
  "/admin",
  adminMiddleware,
  Controllers.Notification.getAdminNotifications
);

notificationRouter.post(
  "/draft/:templateId",
  adminMiddleware,
  validateRequest(Validators.Notification.draftNotification),
  Controllers.Notification.draftNotification
);

notificationRouter.post(
  "/send/:notificationId",
  adminMiddleware,
  validateRequest(Validators.Notification.draftNotification),
  Controllers.Notification.draftNotification
);

notificationRouter.post(
  "/category",
  adminMiddleware,
  validateRequest(Validators.Notification.createCategory),
  Controllers.Notification.createCategory
);

notificationRouter.get("/category", Controllers.Notification.getAllCategpries);

notificationRouter.post(
  "/template",
  adminMiddleware,
  validateRequest(Validators.Notification.createTemplate),
  Controllers.Notification.createTemplate
);

notificationRouter.get("/template", Controllers.Notification.getAllTemplate);
notificationRouter.get(
  "/template/:templateId",
  validateRequest(Validators.Notification.getTemplateByTemplateId),
  Controllers.Notification.getTemplateByTemplateId
);

notificationRouter.put(
  "/template/:templateId",
  adminMiddleware,
  validateRequest(Validators.Notification.updateTemplate),
  Controllers.Notification.updateTemplateByTemplateId
);

notificationRouter.get(
  "/template/category/:categoryId",
  validateRequest(Validators.Notification.getTemplateByCategoryId),
  Controllers.Notification.getTemplateByCategory
);

export default notificationRouter;
