import Services from "..";
import Constants from "@/config/constants";
import { resend } from "@/config/emailClients";

export class email {
  static sendEmail = async (body: {
    emailTeamplates: {
      user: { userId: string; email: string }[];
      subject: string;
      bodyHtml: string;
      bodyText: string;
    }[];
    notificationId: string;
  }) => {
    let delivered: string[] = [];
    let failed: string[] = [];
    let totalSuccess = 0;
    let totalFailure = 0;

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
            channel: Constants.NOTIFICATION.CHANNEL.EMAIL,
          });
        totalSuccess += delivered.length;
        console.log({ deliveredUp });
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
            channel: Constants.NOTIFICATION.CHANNEL.EMAIL,
          });
        console.log({ failedUp });
        totalFailure += failed.length;
        failed = [];
      }
    };

    for (const email of body.emailTeamplates) {
      console.dir({ email }, { depth: null });
      const sendData = await this.sendWithResend({
        to: [...email.user.map((u) => u.email)],
        from: "no-reply@shikshatech.org",
        subject: email.subject,
        body: email.bodyHtml,
      });
      const userIds = [...email.user.map((u) => u.userId)];
      if (sendData.success) {
        delivered.push(...userIds);
        await updateNotificationInChunk(false);
      } else {
        failed.push(...userIds);
        await updateNotificationInChunk(false);
      }
    }
    await updateNotificationInChunk(true);
    return await Services.Notification.updateNotificationStatus({
      notificationId: body.notificationId,
      totalFailure,
      totalSuccess,
      channel: Constants.NOTIFICATION.CHANNEL.EMAIL,
      status: Constants.NOTIFICATION.SENT_STATUS.SENT,
    });
  };

  private static sendWithResend = async (body: {
    to: string[];
    from: string;
    subject: string;
    body: string;
  }) => {
    console.dir({ body }, { depth: null });
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
