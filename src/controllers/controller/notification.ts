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
  static sendDraftedNotification = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { notificationId }: any = req.params;
      const notficationData = await Services.Notification.getNotification({
        schoolId,
        notificationId,
      });
      if (notficationData.length === 0) {
        throw new Error(`This notification is not belongs to your School!`);
      }
      const orginalPayload: any = notficationData[0]?.payload;
      const isDynamicEmail = orginalPayload.variables.length > 0;
      const draftedNotification =
        await Services.Notification.getDraftedNotifications({
          notificationId,
          status: Constants.NOTIFICATION.SENT_STATUS.DRAFT,
        });
      const emailTeamplates = [];
      if (isDynamicEmail) {
        emailTeamplates.push(
          ...draftedNotification.map((d: any) => {
            const tempPayLoad: any =
              Services.Helper.notification.buildNotificationPayload(
                orginalPayload,
                d.payloadVariables
              );
            return {
              user: [{ userId: d.user.id, email: d.user.email }],
              ...tempPayLoad,
            };
          })
        );
      } else {
        emailTeamplates.push({
          user: draftedNotification.map((n) => {
            return {
              userId: n.user.id,
              email: n.user.email,
            };
          }),
          ...orginalPayload,
        });
      }
      if (emailTeamplates.length === 0) {
        throw new Error("No drafted Emails found for deliver!");
      }
      const response = await Services.Helper.email.sendEmail({
        emailTeamplates,
        notificationId,
      });
      console.dir({ emailTeamplates }, { depth: null });
      return successResponse(res, "Notifications Sent Successfully", response);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getAdminNotifications = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;

      const notifications = await Services.Notification.getNotification({
        schoolId,
      });

      return successResponse(
        res,
        "All Notification Fetched Successfully",
        notifications
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

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

      const response = await db.transaction(async (tx) => {
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
        return notificationStatusData;
      });

      return successResponse(res, "Notification Drafted Successfully", {
        response,
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

  static userNotifications = async (req: Request, res: Response) => {
    try {
      const { userId, schoolId } = req.user;
      const data = await Services.Notification.getUserNotification({
        userId,
        schoolId,
      });
      return successResponse(
        res,
        "User notifcation fetched Successfully",
        data
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static seenNotification = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user;
      const { notificationRecipentId }: any = req.params;
      await Services.Notification.seenNotification({
        userId,
        notificationRecipentId,
      });
      return successResponse(res, "Notification Seen Successfully", null);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };
}
