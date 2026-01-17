import { Request, Response } from "express";
import { errorResponse, successResponse } from "@/config/response";
import Services from "@/services";
import Constants, {
  NOTIFICATION_CHANNEL_TYPES,
  NOTIFICATION_VARIABLE_LIST,
} from "@/config/constants";
import { NotificationTemplatePayload } from "@/types/types";
import { SendNotificationInput } from "@/validators/types";
import { db } from "@/db";
import {
  notificationRecipient_Table,
  notificationStatus_Table,
} from "@/db/schema";

const VARIABLES = Constants.NOTIFICATION.VARIABLES;

export class Notification {
  static broadcastDraftedNotification = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { notificationId }: any = req.params;
      console.log("****************************************************");
      const notficationData = await Services.Notification.getNotification({
        schoolId,
        notificationId,
      });
      if (notficationData.length === 0) {
        throw new Error(`This notification is not belongs to your School!`);
      }
      const orginalPayload: any = notficationData[0]?.payload;
      const isDynamicNotification = orginalPayload.variables.length > 0;
      const draftedNotification =
        await Services.Notification.getDraftedNotifications({
          notificationId,
          status: Constants.NOTIFICATION.SENT_STATUS.DRAFT,
        });
      if (draftedNotification.length === 0) {
        throw new Error("No drafted Emails found for deliver!");
      }
      const emailNotifications: any[] = [];
      const smsNotifications: any[] = [];
      if (isDynamicNotification) {
        draftedNotification.forEach((d, index) => {
          const tempPayLoad: any =
            Services.Helper.notification.buildNotificationPayload(
              orginalPayload,
              d.payloadVariables as any
            );
          const payload = {
            user: [
              {
                userId: d.user.id,
                email: d.user.email,
                phone: d.user.phone,
              },
            ],
            ...tempPayLoad,
          };
          if (d.channel === Constants.NOTIFICATION.CHANNEL.EMAIL) {
            emailNotifications.push(payload);
          } else if (d.channel === Constants.NOTIFICATION.CHANNEL.SMS) {
            smsNotifications.push(payload);
          }
        });
      } else {
        const emailnotificationUserDetails: any[] = [];
        const smsNotificationUserDetails: any[] = [];
        draftedNotification.forEach((n) => {
          const payload = {
            userId: n.user.id,
            email: n.user.email,
            phone: n.user.phone,
          };
          if (n.channel === Constants.NOTIFICATION.CHANNEL.EMAIL) {
            emailnotificationUserDetails.push(payload);
          } else if (n.channel === Constants.NOTIFICATION.CHANNEL.SMS) {
            smsNotificationUserDetails.push(payload);
          }
        });
        if (emailnotificationUserDetails.length > 0) {
          emailNotifications.push({
            user: [...emailnotificationUserDetails],
            ...orginalPayload,
          });
        }
        if (smsNotificationUserDetails.length > 0) {
          smsNotifications.push({
            user: [...smsNotificationUserDetails],
            ...orginalPayload,
          });
        }
      }

      const channelsData: {
        channel: NOTIFICATION_CHANNEL_TYPES;
        requiredBal: number;
        notifications: any[];
      }[] = [];

      let notificationEachChannel = 0;

      if (emailNotifications.length > 0) {
        channelsData.push({
          channel: Constants.NOTIFICATION.CHANNEL.EMAIL,
          requiredBal: emailNotifications.length,
          notifications: emailNotifications,
        });
        notificationEachChannel = emailNotifications.length;
      }

      if (smsNotifications.length > 0) {
        channelsData.push({
          channel: Constants.NOTIFICATION.CHANNEL.SMS,
          requiredBal: smsNotifications.length,
          notifications: smsNotifications,
        });
        notificationEachChannel = smsNotifications.length;
      }

      /*************************   Validation - Does School have enough Balance. ***************************/

      const { plans, channelsBalanceMap } =
        await NotificationHelper.getActivePlanInstanceAndValidateBalance({
          schoolId,
          requiredBal: notificationEachChannel,
          channels: channelsData.map((c) => c.channel),
        });

      console.dir({ channelsBalanceMap }, { depth: null });

      /****************************************************/

      /************************* Validation - System And School Does not exceed limits ***************************/

      const validationErrors: any[] = [];

      for (const ch of channelsData) {
        const validationResult =
          await NotificationHelper.validateSystemOrgUsageLeft({
            channel: ch.channel,
            requiredCredits: ch.requiredBal,
            schoolId,
          });
        validationErrors.push(...validationResult);
      }

      if (validationErrors.length > 0) {
        throw new Error(`${validationErrors.join(" | ")}`);
      }

      /****************************************************/

      const responseData: any = {};

      for (const ch of channelsData) {
        const responseBroadcast =
          await NotificationHelper.broadcastNotification({
            channel: ch.channel,
            notifications: ch.notifications,
            plans,
            notificationId,
            schoolId,
            channelsBalanceMap,
          });
        responseData[ch.channel] = responseBroadcast;
      }

      return successResponse(
        res,
        "Notifications Sent Successfully",
        responseData
      );
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

  static getLedger = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { pageNo = 1, pageSize = 15, id }: any = req.query;
      const ledgerInfo = await Services.Notification.getLedger({
        schoolId,
        id,
        pageNo,
        pageSize,
      });
      return successResponse(res, "Notification Ledger fetched", ledgerInfo);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getAdminNotificationsDetailed = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { schoolId } = req.user;
      const { notificationId }: any = req.params;
      const { pageNo = "1", pageSize = "10" }: any = req.query;
      const limit = parseInt(pageSize);
      const offSet = (parseInt(pageNo) - 1) * limit;
      const notifications = await Services.Notification.getNotificationDetailed(
        {
          schoolId,
          notificationId,
          limit,
          offSet,
        }
      );
      return successResponse(
        res,
        "Detailed Notification Fetched Successfully",
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
      // console.log({ body });
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

      await NotificationHelper.getActivePlanInstanceAndValidateBalance({
        schoolId,
        requiredBal: allUsersInfo.length,
        channels,
      });

      const response = await db.transaction(async (tx) => {
        const newNotification =
          await Services.Notification.createNewNotification(tx, {
            templateId,
            categoryId,
            schoolId,
            payload: payload,
            channels: channels,
            userId,
          });
        // console.log({ newNotification });

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

        // console.dir({ notificationStatusData }, { depth: null });

        const notificationRecipentData = await tx
          .insert(notificationRecipient_Table)
          .values(bulkRecipents)
          .returning();

        // console.dir({ notificationRecipentData }, { depth: null });
        // return notificationStatusData;
        return Services.Notification.getNotification({
          schoolId,
          notificationId: notificationId!,
        });
      });

      return successResponse(
        res,
        "Notification Drafted Successfully",
        response
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getNotificationDynamicVariable = async (
    req: Request,
    res: Response
  ) => {
    try {
      return successResponse(
        res,
        "Dynamic Variables Fetched Successfully!",
        NOTIFICATION_VARIABLE_LIST
      );
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

  static getAllNotificationPlans = async (req: Request, res: Response) => {
    try {
      const plans = await Services.SystemAdmin.getAllNotificationPlans({
        isActive: true,
        planType: Constants.NOTIFICATION.BILLING.PLAN_TYPES.PUBLIC,
      });
      return successResponse(
        res,
        "All Active Plan fetched Successfully!",
        plans
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getAllPurchasedPlans = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { showAll } = req.query;
      const plans = await Services.SystemAdmin.getPlanInstances({
        schoolId,
        showAllDetail: true,
        isExhausted: showAll === "1",
      });
      return successResponse(
        res,
        "All Purchased Plan fetched Successfully!",
        plans
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getAllPurchasedPlansDetail = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { planInstanceId } = req.params;
      const plans = await Services.SystemAdmin.getPlanInstances({
        schoolId,
        id: planInstanceId!,
        showAllDetail: true,
      });
      return successResponse(
        res,
        "All Purchased Plan fetched Successfully!",
        plans
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };
}

class NotificationHelper {
  private static substractCreditsFromPlansQueries = (body: {
    available: number;
    required: number;
    channel: NOTIFICATION_CHANNEL_TYPES;
    plans: any[];
  }) => {
    const updateQueries: {
      channelId: string;
      planInstanceId: string;
      unitsConsumed: number;
      isExhaushed: boolean;
    }[] = [];
    let requiredLeft = body.required;
    for (const plan of body.plans) {
      const { id, purchasedChannels }: any = plan;
      const planInstanceId = id;
      for (const p of purchasedChannels) {
        const { id, channel, unitsTotal, unitsConsumed } = p;
        const unitsAvailable = unitsTotal - unitsConsumed;
        if (channel === body.channel) {
          if (unitsAvailable >= requiredLeft) {
            updateQueries.push({
              channelId: id,
              planInstanceId,
              unitsConsumed: unitsConsumed + requiredLeft,
              isExhaushed: unitsAvailable === requiredLeft,
            });
            requiredLeft = 0;
          } else {
            updateQueries.push({
              channelId: id,
              planInstanceId,
              unitsConsumed: unitsConsumed + unitsAvailable,
              isExhaushed: true,
            });
            requiredLeft = requiredLeft - unitsAvailable;
          }
          if (requiredLeft === 0) {
            return updateQueries;
          }
        }
      }
    }
    return updateQueries;
  };

  static getActivePlanInstanceAndValidateBalance = async (body: {
    schoolId: string;
    channels: NOTIFICATION_CHANNEL_TYPES[];
    requiredBal: number;
  }) => {
    const plans = await Services.SystemAdmin.getPlanInstances({
      schoolId: body.schoolId,
      showAllDetail: true,
      isExhausted: false,
      isActive: true,
    });
    if (!plans || plans.length === 0) {
      throw new Error("No active plan available!, please purchase plan first");
    }
    let channelsBalanceMap = new Map<NOTIFICATION_CHANNEL_TYPES, number>();
    plans.forEach((p: any, index) => {
      const { purchasedChannels } = p;
      purchasedChannels.forEach((plan: any) => {
        const { channel, unitsTotal, unitsConsumed } = plan;
        const unitsLeft = unitsTotal - unitsConsumed;
        if (channelsBalanceMap.has(channel)) {
          const newBal = (channelsBalanceMap.get(channel) || 0) + unitsLeft;
          channelsBalanceMap.set(channel, newBal);
        } else {
          channelsBalanceMap.set(channel, unitsLeft);
        }
      });
    });
    const insufficientChannels: {
      channel: string;
      available: number;
    }[] = [];

    for (const c of body.channels) {
      const bal = channelsBalanceMap.get(c) || 0;

      if (body.requiredBal > bal) {
        insufficientChannels.push({
          channel: c,
          available: bal,
        });
      }
    }

    if (insufficientChannels.length > 0) {
      const details = insufficientChannels
        .map(
          ({ channel, available }) =>
            `${channel}: available ${available}, required ${body.requiredBal}`
        )
        .join(" | ");

      throw new Error(
        `Insufficient credits for one or more channels. ${details}. ` +
          `Please purchase additional credits to continue.`
      );
    }
    return { plans, channelsBalanceMap };
  };

  static broadcastNotification = async (body: {
    channel: NOTIFICATION_CHANNEL_TYPES;
    notifications: any[];
    plans: any[];
    notificationId: string;
    schoolId: string;
    channelsBalanceMap: Map<NOTIFICATION_CHANNEL_TYPES, number>;
  }) => {
    const avlBal = body.channelsBalanceMap.get(body.channel) || 0;
    const requiredBal = body.notifications.length;

    const updateChannelsQueries = this.substractCreditsFromPlansQueries({
      available: avlBal,
      required: requiredBal,
      channel: body.channel,
      plans: body.plans,
    });

    console.dir({ updateChannelsQueries }, { depth: null });

    await Services.Helper.Broadcast.broadcastNotification({
      notificationBody: body.notifications,
      notificationId: body.notificationId,
      channel: body.channel,
      updateChannels: updateChannelsQueries,
      schoolId: body.schoolId,
    });

    return {
      initalCredits: avlBal,
      creditsConsumed: requiredBal,
      creditsLeft: avlBal - requiredBal,
    };
  };

  static validateSystemOrgUsageLeft = async (body: {
    channel: NOTIFICATION_CHANNEL_TYPES;
    requiredCredits: number;
    schoolId: string;
  }) => {
    const systemInvetories = await Services.SystemAdmin.getSystemInventory({
      channel: body.channel,
      active: true,
    });
    if (!systemInvetories || systemInvetories.length === 0) {
      return [`System Inventory has no active plan for ${body.channel}!`];
    }

    const unitsPurchased = systemInvetories[0]?.unitsPurchased || 0;
    const unitsConsumed = systemInvetories[0]?.unitsConsumed || 0;
    const unitsAvailable = unitsPurchased - unitsConsumed;

    if (unitsAvailable < body.requiredCredits) {
      return [`System has insuffiecient balance for ${body.channel} channel!`];
    }

    let i = 0;
    const limitReachedErrors = [];
    do {
      const shouldCheckForSchool = i++ === 1;
      const limits = await Services.SystemAdmin.getNotifChannelUsageLimit({
        channel: body.channel,
        orgType: shouldCheckForSchool ? "SCHOOL" : "SYSTEM",
        ...(shouldCheckForSchool && { schoolId: body.schoolId }),
      });
      console.log({ shouldCheckForSchool, limits });
      const DateRanges = Constants.NOTIFICATION.BILLING.USAGE_LIMIT;

      const frequencyOrder: any = {
        [DateRanges.ONE_TIME]: 0,
        [DateRanges.DAILY]: 1,
        [DateRanges.WEEKLY]: 2,
        [DateRanges.MONTHLY]: 3,
        [DateRanges.YEARLY]: 4,
      } as const;

      const sortedLimits = limits.sort(
        (a, b) => frequencyOrder[a.frequency] - frequencyOrder[b.frequency]
      );

      console.log({ sortedLimits });
      for (const limitData of sortedLimits) {
        const { frequency, limit } = limitData;
        switch (frequency) {
          case "DAILY":
          case "MONTHLY":
          case "WEEKLY":
          case "YEARLY":
            const totalConsumed =
              await Services.Notification.getCreditsUsagesRangeWise({
                frequency,
                channel: body.channel,
                ...(shouldCheckForSchool && { schoolId: body.schoolId }),
              });
            console.dir(
              {
                totalConsumed,
                frequency,
                limit,
                body,
              },
              { depth: null }
            );
            if (totalConsumed + body.requiredCredits > limit) {
              limitReachedErrors.push(
                `${
                  shouldCheckForSchool ? "Your Organization's" : "The system’s"
                } ${frequency} limit for ${
                  body.channel
                } is ${limit} and consumed till now ${totalConsumed}. ` +
                  `Sending this notification requires ${
                    body.requiredCredits
                  } credits that will exceed the ${
                    shouldCheckForSchool ? "school’s" : "system’s"
                  } ${frequency} limit.`
              );
            }
            break;
          case "ONE_TIME":
            if (limit < body.requiredCredits) {
              limitReachedErrors.push(
                `${
                  shouldCheckForSchool ? "Your Organization's" : "The system’s"
                } ${frequency} limit for ${body.channel} is ${limit}. ` +
                  `Sending this notification requires ${
                    body.requiredCredits
                  } credits that will exceed the ${
                    shouldCheckForSchool ? "school’s" : "system’s"
                  } ${frequency} limit.`
              );
            }
            break;
          default:
            continue;
        }
        console.log({ limitReachedErrors });
      }
    } while (i < 2);
    return limitReachedErrors;
  };
}
