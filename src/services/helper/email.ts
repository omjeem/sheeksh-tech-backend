import Services from "..";
import Constants, { NOTIFICATION_CHANNEL_TYPES } from "@/config/constants";
import { resend } from "@/config/emailClients";
import { envConfigs } from "@/config/envConfig";
import { db } from "@/db";
import {
  notificationRecipientAck_Table,
  notifiSystemInventory_Table,
  notifPlanInstance_Table,
  notifPurchasedChannelWise_Table,
} from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export class Broadcast {
  static broadcastNotification = async (body: {
    notificationBody: {
      user: {
        userId: string;
        email: string;
        phone: any;
        channel: string;
        recipentId: string;
      }[];
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
    const usersToSentNotf: {
      userId: string;
      recipentId: string;
      to: string;
      from: string;
      subject: string;
      body: string;
    }[] = [];
    const footerHtml = `
         <hr style="margin-top:24px;margin-bottom:12px;border:none;border-top:1px solid #e5e7eb;" />
         <p style="font-size:12px;color:#6b7280;text-align:center;margin:0;">
           Sent by <strong>shikshatech.org</strong><br />
           Contact us at
           <a href="mailto:contact@shikshatech.org" style="color:#2563eb;text-decoration:none;">
             contact@shikshatech.org
           </a>
         </p>
        `;

    // console.dir({ body }, { depth: null });
    for (const notif of body.notificationBody) {
      if (body.channel === Constants.NOTIFICATION.CHANNEL.EMAIL) {
        notif.user.forEach((u) => {
          usersToSentNotf.push({
            recipentId: u.recipentId,
            userId: u.userId,
            to: u.email,
            from: "Shiksha@shikshatech.org",
            subject: notif.subject,
            body: `${notif.bodyHtml}${footerHtml}`,
          });
        });
      } else if (body.channel === Constants.NOTIFICATION.CHANNEL.SMS) {
        notif.user.forEach((u) => {
          usersToSentNotf.push({
            recipentId: u.recipentId,
            userId: u.userId,
            to: u.phone,
            from: "9999999999",
            subject: notif.subject,
            body: notif.bodyText,
          });
        });
      }
    }
    // console.dir({ usersToSentNotf }, { depth: null });

    const processInBatches = async (batchSize: number) => {
      for (let i = 0; i < usersToSentNotf.length; i += batchSize) {
        const batch = usersToSentNotf.slice(i, i + batchSize);
        console.log(`Processing batch ${i / batchSize + 1}`);
        const response = await Email.sendWithResend(batch, body.notificationId);
        if (!response.success) {
          console.log("Error in sending the notitifiction", response.error);
          throw new Error(response.error?.message);
        }
        const data = response.data!;
        await db.insert(notificationRecipientAck_Table).values(data);
        const usersIdsUpdate =
          await Services.Notification.updateRecipentsNotifications({
            userIds: [...batch.map((b) => b.userId)],
            notificationId: body.notificationId,
            status: Constants.NOTIFICATION.SENT_STATUS.SENT,
            channel: body.channel,
          });
        // console.log({ usersIdsUpdate });
      }
    };
    await processInBatches(10);
    
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
        creditsUsed: usersToSentNotf.length,
        channel: body.channel,
      });
      // console.dir({ update, schoolLedger }, { depth: null });
    }
    await db
      .update(notifiSystemInventory_Table)
      .set({
        unitsConsumed: sql`${notifiSystemInventory_Table.unitsConsumed} + ${usersToSentNotf.length}`,
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
      totalFailure: 0,
      totalSuccess: usersToSentNotf.length,
      channel: body.channel,
      status: Constants.NOTIFICATION.SENT_STATUS.SENT,
    });
  };
}

class Email {
  static sendWithResend = async (
    body: {
      recipentId: string;
      userId: string;
      to: string;
      from: string;
      subject: string;
      body: string;
    }[],
    notificationId: string
  ) => {
    try {
      if (envConfigs.nodeEnv === "prod") {
        const { data, error } = await resend.batch.send(
          body.map((b) => ({
            to: b.to,
            from: b.from,
            subject: b.subject,
            html: b.body,
          }))
        );
        if (error) {
          return { success: false, error };
        }
        const ack = body.map((b, index) => {
          return {
            notificationId,
            reciepntId: b.recipentId,
            ackId: data.data[index]?.id,
          };
        });
        console.log("Sending from Production");
        return { success: true, data: ack };
      } else {
        console.log("Sending from Demo");
        const ack = body.map((b) => {
          return {
            notificationId,
            reciepntId: b.recipentId,
            ackId: `test_${Math.random().toFixed(7)}`,
          };
        });
        return { success: true, data: ack };
      }
    } catch (error: any) {
      console.log("Error In resend Api", error);
      return { success: false, message: error };
    }
  };

  static sendSms = async (body: {
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
