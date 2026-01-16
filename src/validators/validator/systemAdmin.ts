import Constants, { NOTIFICATION_CHANNEL_LIST } from "@/config/constants";
import z from "zod";

export class SystemAdmin {
  static profileUpdate = z.object({
    body: z.object({
      password: z.string().min(3),
    }),
  });


  static createNotificationPlan = z.object({
    body: z.object({
      key: z.string().min(3),
      name: z.string().min(3),
      description: z.string().min(3),
      planType: z.enum(Constants.NOTIFICATION.BILLING.PLAN_TYPES),
      basePrice: z.number(),
      currency: z.string(),
      metadata: z.any().optional(),
      features: z
        .array(
          z.object({
            channel: z.enum(Constants.NOTIFICATION.CHANNEL),
            units: z.number().min(1),
            metadata: z.any().optional(),
          })
        )
        .nonempty(),
    }),
  });

  static purchaseNotificationPlanBySystemAdmin = z.object({
    body: z.object({
      planId: z.uuid(),
      schoolId: z.uuid(),
      price: z.number().optional(),
    }),
  });

  static updateSystemInventoryLimits = z.object({
    body: z.object({
      id: z.uuid(),
      metadata: z.any(),
    }),
  });

  static addCreditsIntoSystemInventory = z.object({
    body: z.object({
      channel: z.enum(NOTIFICATION_CHANNEL_LIST),
      provider: z.enum(
        Constants.NOTIFICATION.BILLING.SYSTEM_INVENTORY.PROVIDERS
      ),
      providerInvoiceId: z.string().optional(),
      unitsPurchased: z.number(),
      metadata: z.any(),
    }),
  });

  static notifChannelUsageLimit = z.object({
    body: z.object({
      id: z.uuid().optional(),
      schoolId: z.uuid().optional(),
      channel: z.enum(Constants.NOTIFICATION.CHANNEL),
      frequency: z.enum(Constants.NOTIFICATION.BILLING.USAGE_LIMIT),
      limit: z.number(),
    }),
  });
}
