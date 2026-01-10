import Constants from "@/config/constants";
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
            limit: z.array(
              z.object({
                period: z.enum(Constants.NOTIFICATION.BILLING.USAGE_LIMIT),
                maxUnits: z.number().min(1),
                metadata: z.any().optional(),
              })
            ),
          })
        )
        .nonempty(),
    }),
  });
}
