import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";
import Constants from "../../config/constants";
import { NotificationTemplatePayload } from "../../types/types";
import { SendNotificationInput } from "../../validators/types";

const VARIABLES = Constants.NOTIFICATION.VARIABLES;

export class Notification {
  static sendNotification = async (req: Request, res: Response) => {
    try {
      const { schoolId, userId } = req.user;
      const body: SendNotificationInput["body"] = req.body;
      const { templateId }: any = req.params;
      const sessions = await Services.Session.get(schoolId, true);
      const sessionId = sessions[0]?.id;
      if (!sessionId) {
        throw new Error("There is no active session of School!");
      }
      console.log({ body });

      const templateData: any =
        await Services.Notification.getTemplateByIdAndSchoolId({
          templateId,
          schoolId,
        });
      if (!templateData) {
        throw new Error("Template not exists or not belongs to this school");
      }
      const categoryId = templateData.categoryId;
      const payload: NotificationTemplatePayload = templateData.templatePayload;
      const varibales = payload.variables;
      const allUsersInfo =
        await Services.Notification.getAndValidateUsersDetailsToSentNotification(
          body,
          schoolId,
          varibales,
          sessionId
        );
      console.log(allUsersInfo, "Total - ", allUsersInfo.length);

      const notificationVariables: Record<string, string> = {};
      const userInfo = await Services.User.getUserDetails(userId);

      varibales.forEach((v) => {
        if (v === VARIABLES.recipientEmail) {
          notificationVariables[VARIABLES.recipientEmail] = userInfo?.email!;
        }
        if (v === VARIABLES.recipientName) {
          notificationVariables[VARIABLES.recipientName] = userInfo?.firstName!;
        }
        if (v === VARIABLES.recipientRole) {
          notificationVariables[VARIABLES.recipientRole] = userInfo?.role!;
        }
      });

      console.log("Payload Content ", payload);
      const tempPayLoad = Services.Helper.notification.buildNotificationPayload(
        payload,
        notificationVariables
      );

      // const sendNotification = await db.transaction(async (tx) => {
      //   const newNotification =
      //     await Services.Notification.createNewNotification(tx, {
      //       templateId,
      //       categoryId,
      //       schoolId,
      //       payload: payload,
      //       channels: [Constants.NOTIFICATION.CHANNEL.EMAIL],
      //       userId,
      //     });
      //   const notificationId = newNotification[0]?.id;
      //   const recepientObj = {
      //     notificationId,
      //     userId,
      //     channel: Constants.NOTIFICATION.CHANNEL.EMAIL,
      //   };
      //   console.log({ newNotification });
      // });

      return successResponse(res, "Notification Sent Successfully", {
        allUsersInfo,
        sendNotification: null,
        tempPayLoad,
      });
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static createCategory = async (req: Request, res: Response) => {
    try {
      const { userId, schoolId } = req.user;
      const { categories } = req.body;
      const categoryData = await Services.Notification.createCategory({
        userId,
        schoolId,
        categories,
      });
      return successResponse(
        res,
        "Categories created Successfully",
        categoryData
      );
    } catch (error: any) {
      console.log("Error in creating the category", error);
      return errorResponse(res, error.message || error);
    }
  };

  static getAllCategpries = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const categoryData = await Services.Notification.getAllCategories(
        schoolId
      );
      return successResponse(
        res,
        "Categories data fetched Successfully",
        categoryData
      );
    } catch (error: any) {
      console.log("Error in Getting the category data", error);
      return errorResponse(res, error.message || error);
    }
  };

  static createTemplate = async (req: Request, res: Response) => {
    try {
      const { schoolId, userId } = req.user;
      const { name, payload, categoryId } = req.body;
      const [templateData] = await Services.Notification.createTemplate({
        schoolId,
        userId,
        name,
        payload,
        categoryId,
      });
      return successResponse(
        res,
        "Template created Successfully",
        templateData
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getTemplateByTemplateId = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { templateId } = req.params;
      const templateData = await Services.Notification.getAllTemplate(
        schoolId,
        templateId
      );
      return successResponse(
        res,
        "Template Fetched Successfully",
        templateData
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getAllTemplate = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const templateData = await Services.Notification.getAllTemplate(schoolId);
      return successResponse(
        res,
        "Template Fetched Successfully",
        templateData
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getTemplateByCategory = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { categoryId } = req.params;
      const templateData = await Services.Notification.getTemplateByCategory({
        schoolId,
        categoryId: String(categoryId),
      });
      return successResponse(
        res,
        "Template Fetched Successfully",
        templateData
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static updateTemplateByTemplateId = async (req: Request, res: Response) => {
    try {
      const { schoolId, userId } = req.user;
      const { templateId } = req.params;
      const body = req.body;
      const updateData = await Services.Notification.updateTemplateById({
        templateId: String(templateId),
        schoolId,
        userId,
        payload: body,
      });
      return successResponse(res, "Template Updated Successfully!", updateData);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };
}
