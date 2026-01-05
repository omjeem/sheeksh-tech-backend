import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";
import Constants from "../../config/constants";
import { NotificationTemplatePayload } from "../../types/types";
import { SendNotificationInput } from "../../validators/types";
import { db } from "../../config/db";
import {
  notificationRecipient_Table,
  notificationStatus_Table,
} from "../../config/schema";

const VARIABLES = Constants.NOTIFICATION.VARIABLES;

export class Notification {

  static draftNotification = async (req: Request, res: Response) => {
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

      const channels = body.channels;

      console.log("Payload Content ", payload);
      // const tempPayLoad = Services.Helper.notification.buildNotificationPayload(
      //   payload,
      //   notificationVariables
      // );

      await db.transaction(async (tx) => {
        const newNotification =
          await Services.Notification.createNewNotification(tx, {
            templateId,
            categoryId,
            schoolId,
            payload: payload,
            channels: [Constants.NOTIFICATION.CHANNEL.EMAIL],
            userId,
          });
        console.log({ newNotification });

        const notificationId = newNotification[0]?.id;
        const bulkRecipents: any = [];
        const notificationStatus: any = [];

        channels.forEach((c) => {
          notificationStatus.push({
            notificationId,
            channel: c,
            totalRecipients: allUsersInfo.length,
          });
          bulkRecipents.push(
            ...allUsersInfo.map((u: any) => {
              const notificationVariables: Record<string, string> = {};
              varibales.forEach((v) => {
                if (v === VARIABLES.recipientEmail) {
                  notificationVariables[VARIABLES.recipientEmail] = u.email;
                }
                if (v === VARIABLES.recipientName) {
                  notificationVariables[VARIABLES.recipientName] = u.firstName;
                }
                if (v === VARIABLES.recipientRole) {
                  notificationVariables[VARIABLES.recipientRole] = u.role;
                }
                if (v === VARIABLES.recipientDob) {
                  notificationVariables[VARIABLES.recipientDob] = u.dateOfBirth;
                }
                if (v === VARIABLES.recipientPhone) {
                  notificationVariables[VARIABLES.recipientPhone] = u.phone;
                }
              });
              return {
                notificationId,
                userId: u.id,
                channel: c,
                status: Constants.NOTIFICATION.SENT_STATUS.DRAFT,
                payloadVariables: notificationVariables,
              };
            })
          );
        });
        const notificationStatusData = await tx
          .insert(notificationStatus_Table)
          .values(notificationStatus)
          .returning();

        console.dir({ notificationStatusData }, { depth: null });

        const notificationRecipentData = await tx
          .insert(notificationRecipient_Table)
          .values(bulkRecipents)
          .returning();

        console.dir({ notificationRecipentData }, { depth: null });
      });

      return successResponse(res, "Notification Drafted Successfully", {
        allUsersInfo,
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
