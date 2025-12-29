import express from "express";
import { adminMiddleware } from "../../middlewares/userRolesMiddleware";
import { authMiddleware } from "../../middlewares/authMiddleware";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";

const notificationRouter = express.Router();
notificationRouter.use(authMiddleware);

notificationRouter.post(
  "/category",
  validateRequest(Validators.Notification.createCategory),
  adminMiddleware,
  Controllers.Notification.createCategory
);

notificationRouter.get("/category", Controllers.Notification.getAllCategpries);

notificationRouter.post(
  "/template",
  validateRequest(Validators.Notification.createTemplate),
  adminMiddleware,
  Controllers.Notification.createTemplate
);

notificationRouter.get("/template", Controllers.Notification.getAllTemplate);
notificationRouter.get(
  "/template/:templateId",
  validateRequest(Validators.Notification.getTemplateByTemplateId),
  Controllers.Notification.getTemplateByTemplateId
);

notificationRouter.get(
  "/template/category/:categoryId",
  validateRequest(Validators.Notification.getTemplateByCategoryId),
  Controllers.Notification.getTemplateByCategory
);

export default notificationRouter;
