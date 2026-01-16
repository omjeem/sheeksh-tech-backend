import Services from "..";
import Constants, { NOTIFICATION_CHANNEL_TYPES } from "@/config/constants";
import { resend } from "@/config/emailClients";
import { db } from "@/db";
import {
  notifiSystemInventory_Table,
  notifPlanInstance_Table,
  notifPurchasedChannelWise_Table,
} from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export class Broadcast {
  static broadcastNotification = async (body: {
    notificationBody: {
      user: { userId: string; email: string; phone: any; channel: string }[];
      subject: string;
      bodyHtml: string;
      bodyText: string;
    }[];
    notificationId: string;
    channel: NOTIFICATION_CHANNEL_TYPES;
    updateChannels: {
      channelId: string;
      planInstanceId: string;
      unitsConsumed: number;
      isExhaushed: boolean;
    }[];
    schoolId: string;
  }) => {
    let delivered: string[] = [];
    let failed: string[] = [];
    let totalSuccess = 0;
    let totalFailure = 0;
    // console.dir({ body }, { depth: null });
    const updateNotificationInChunk = async (proceedDirectly: boolean) => {
      if (
        (proceedDirectly ||
          delivered.length > Constants.NOTIFICATION.SENT_SIZE) &&
        delivered.length > 0
      ) {
        const deliveredUp =
          await Services.Notification.updateRecipentsNotifications({
            userIds: [...delivered],
            notificationId: body.notificationId,
            status: Constants.NOTIFICATION.SENT_STATUS.SENT,
            channel: body.channel,
          });
        totalSuccess += delivered.length;
        // console.log({ deliveredUp });
        delivered = [];
      }
      if (
        (proceedDirectly ||
          delivered.length > Constants.NOTIFICATION.SENT_SIZE) &&
        failed.length > 0
      ) {
        const failedUp =
          await Services.Notification.updateRecipentsNotifications({
            userIds: [...failed],
            notificationId: body.notificationId,
            status: Constants.NOTIFICATION.SENT_STATUS.FAILED,
            channel: body.channel,
          });
        // console.log({ failedUp });
        totalFailure += failed.length;
        failed = [];
      }
    };

    for (const notif of body.notificationBody) {
      // console.dir({ notif }, { depth: null });
      let sendData: any;
      if (body.channel === Constants.NOTIFICATION.CHANNEL.EMAIL) {
        sendData = await this.sendWithResend({
          to: [...notif.user.map((u) => u.email)],
          from: "no-reply@shikshatech.org",
          subject: notif.subject,
          body: notif.bodyHtml,
        });
      } else if (body.channel === Constants.NOTIFICATION.CHANNEL.SMS) {
        sendData = await this.sendSms({
          to: [...notif.user.map((u) => u.phone)],
          from: "9999999999",
          subject: notif.subject,
          body: notif.bodyText,
        });
      }
      const userIds = [...notif.user.map((u) => u.userId)];
      if (sendData.success) {
        delivered.push(...userIds);
        await updateNotificationInChunk(false);
      } else {
        failed.push(...userIds);
        await updateNotificationInChunk(false);
      }
    }
    await updateNotificationInChunk(true);
    const markPlanInstanceExhaustedIfAllChannelsExhausted = async (
      planInstanceId: string
    ) => {
      await db
        .update(notifPlanInstance_Table)
        .set({
          isExhausted: true,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(notifPlanInstance_Table.id, planInstanceId),

            sql`NOT EXISTS (
              SELECT 1
              FROM ${notifPurchasedChannelWise_Table}
              WHERE ${notifPurchasedChannelWise_Table.planInstanceId} = ${planInstanceId}
                AND ${notifPurchasedChannelWise_Table.isExhausted} = false
             )`
          )
        );
    };
    for (const ch of body.updateChannels) {
      const update = await db
        .update(notifPurchasedChannelWise_Table)
        .set({
          unitsConsumed: ch.unitsConsumed,
          isExhausted: ch.isExhaushed,
          updatedAt: new Date(),
        })
        .where(eq(notifPurchasedChannelWise_Table.id, ch.channelId))
        .returning();

      await markPlanInstanceExhaustedIfAllChannelsExhausted(ch.planInstanceId);
      await Services.Notification.addLogsIntoSchoolLedger({
        schoolId: body.schoolId,
        planInstanceId: ch.planInstanceId,
        operation: Constants.NOTIFICATION.BILLING.LEDGER_REASON.USAGE,
        channelId: ch.channelId,
        notificationId: body.notificationId,
        creditsUsed: totalSuccess,
        channel: body.channel,
      });
      // console.dir({ update, schoolLedger }, { depth: null });
    }
    await db
      .update(notifiSystemInventory_Table)
      .set({
        unitsConsumed: sql`${notifiSystemInventory_Table.unitsConsumed} + ${
          totalSuccess + totalFailure
        }`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(notifiSystemInventory_Table.channel, body.channel),
          eq(notifiSystemInventory_Table.isActive, true)
        )
      );
    return await Services.Notification.updateNotificationStatus({
      notificationId: body.notificationId,
      totalFailure,
      totalSuccess,
      channel: body.channel,
      status: Constants.NOTIFICATION.SENT_STATUS.SENT,
    });
  };

  private static sendWithResend = async (body: {
    to: string[];
    from: string;
    subject: string;
    body: string;
  }) => {
    try {
      // const { data, error } = await resend.emails.send({
      //   from: body.from,
      //   to: [...body.to],
      //   subject: body.subject,
      //   html: body.body,
      // });
      // if (error) {
      //   return { success: false, message: error.message };
      // }
      return { success: true, data: {} };
    } catch (error: any) {
      console.log("Error In resend Api", error);
      return { success: false, message: error.message };
    }
  };

  private static sendSms = async (body: {
    to: number[];
    from: string;
    subject: string;
    body: string;
  }) => {
    try {
      // const { data, error } = await resend.emails.send({
      //   from: body.from,
      //   to: [...body.to],
      //   subject: body.subject,
      //   html: body.body,
      // });
      // if (error) {
      //   return { success: false, message: error.message };
      // }
      return { success: true, data: {} };
    } catch (error: any) {
      console.log("Error In resend Api", error);
      return { success: false, message: error.message };
    }
  };
}
