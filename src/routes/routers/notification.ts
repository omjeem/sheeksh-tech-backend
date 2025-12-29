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

export default notificationRouter;
