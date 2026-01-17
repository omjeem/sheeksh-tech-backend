import z from "zod";
import Validators from ".";

export type SendNotificationInput = z.infer<
  typeof Validators.Notification.draftNotification
>;
export type BulkUserSearch = z.infer<typeof Validators.User.search>;
export type CreateNotificationPlan_Type = z.infer<
  typeof Validators.SystemAdmin.createNotificationPlan
>;

export type PurchaseNotificationPlanBySystemAdmin_Type = z.infer<
  typeof Validators.SystemAdmin.purchaseNotificationPlanBySystemAdmin
>;

export type AddCreditsIntoSystemInventory_Type = z.infer<
  typeof Validators.SystemAdmin.addCreditsIntoSystemInventory
>;

export type NotificationChannelLimits_Type = z.infer<
  typeof Validators.SystemAdmin.notifChannelUsageLimit
>;
