import z from "zod";
import Validators from ".";

export type SendNotificationInput = z.infer<
  typeof Validators.Notification.draftNotification
>;
export type BulkUserSearch = z.infer<typeof Validators.User.search>;
export type CreateNotificationPlan_Type = z.infer<
  typeof Validators.SystemAdmin.createNotificationPlan
>;
