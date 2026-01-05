import z from "zod";
import Validators from ".";

export type SendNotificationInput = z.infer<
  typeof Validators.Notification.draftNotification
>;
