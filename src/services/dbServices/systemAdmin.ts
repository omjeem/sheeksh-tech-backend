import Constants, {
  DATE_RANGE_TYPES,
  NOTIFICATION_CHANNEL_PROVIDERS_TYPES,
  NOTIFICATION_CHANNEL_TYPES,
  ORGANIZATION_TYPES,
  SYSTEM_ADMIN_ACCESS_TYPES,
} from "@/config/constants";
import { db } from "@/db";
import {
  notifChannelUsageLimit_Table,
  notifiSystemInventory_Table,
  notifPlanFeatureLimit_Table,
  notifPlanFeatures_Table,
  notifPlanInstance_Table,
  notifPlans_Table,
  notifPlanTrans_Table,
  notifPurchasedChannelWise_Table,
  systemAdmin_Table,
} from "@/db/schema";
import { Utils } from "@/utils";
import { and, eq, or, sql } from "drizzle-orm";
import Services from "..";
import {
  CreateNotificationPlan_Type,
  PurchaseNotificationPlanBySystemAdmin_Type,
} from "@/validators/types";

export class SystemAdmin {
  static validateUserIdAndPassword = async (
    email: string,
    password: string
  ): Promise<{
    access: SYSTEM_ADMIN_ACCESS_TYPES;
    userId: string;
  }> => {
    const systemAdminDetails = await db.query.systemAdmin_Table.findFirst({
      where: eq(systemAdmin_Table.email, email),
    });
    if (!systemAdminDetails) {
      throw new Error("Invalid System Admin Email");
    }
    if (!Utils.verifyPassword(password, email, systemAdminDetails.password)) {
      throw new Error("Invalid password");
    }
    if (systemAdminDetails.isSuspended) {
      throw new Error(
        "Your account is being suspended please contact the root admin!"
      );
    }
    return {
      access: systemAdminDetails.access as any,
      userId: systemAdminDetails.id,
    };
  };

  static getUserDetails = async (userId: string) => {
    return await db.query.systemAdmin_Table.findFirst({
      where: eq(systemAdmin_Table.id, userId),
      columns: {
        password: false,
        updatedAt: false,
        isSuspended: false,
      },
    });
  };

  static updateProfile = async (
    userId: string,
    body: {
      password?: string;
      name?: string;
      email?: string;
      phone?: string;
    }
  ) => {
    const updateObj = {
      ...(body.password && { password: body.password }),
      ...(body.name && { name: body.name }),
      ...(body.phone && { phone: body.phone }),
    };
    return await db
      .update(systemAdmin_Table)
      .set(updateObj)
      .where(eq(systemAdmin_Table.id, userId));
  };

  static createNotificationPlan = async (
    body: CreateNotificationPlan_Type["body"],
    userId: string
  ) => {
    return await db.transaction(async (tx) => {
      const { features, ...planDeatils } = body;
      const newPLan = await db
        .insert(notifPlans_Table)
        .values({
          ...planDeatils,
          createdBy: userId,
        })
        .returning({
          id: notifPlans_Table.id,
        });
      const planId = newPLan[0]?.id!;
      for (const feature of features) {
        const { limit, ...detail } = feature;
        const featureFeed = await tx
          .insert(notifPlanFeatures_Table)
          .values({
            planId,
            ...detail,
          })
          .returning({
            id: notifPlanFeatures_Table.id,
          });
        console.log({ featureFeed });
        const planFeatureId = featureFeed[0]?.id;
        const planFeatureLimits: any = feature.limit.map((f) => {
          return {
            planFeatureId,
            ...f,
          };
        });
        console.log({ planFeatureLimits });
        const planFeatureLimitsPayload = await tx
          .insert(notifPlanFeatureLimit_Table)
          .values(planFeatureLimits)
          .returning();
      }
      return await this.getAllNotificationPlans({ planId });
    });
  };

  static getAllNotificationPlans = async (body: {
    planId?: string;
    isActive?: boolean;
    planType?: string;
  }) => {
    const whereConditions = [];
    if (body.planId) {
      whereConditions.push(eq(notifPlans_Table.id, body.planId));
    }
    if (body.isActive) {
      whereConditions.push(eq(notifPlans_Table.isActive, body.isActive));
    }
    if (body.planType) {
      whereConditions.push(eq(notifPlans_Table.planType, body.planType));
    }
    return await db.query.notifPlans_Table.findMany({
      where: and(...whereConditions),
      columns: {
        updatedAt: false,
      },
      with: {
        createdBy: {
          columns: {
            id: true,
            name: true,
          },
        },
        feature: {
          columns: {
            planId: false,
            createdAt: false,
          },
          with: {
            featureLimit: {
              columns: {
                planFeatureId: false,
                createdAt: false,
              },
            },
          },
        },
      },
    });
  };

  static getPlanInstances = async (body: {
    schoolId?: string;
    id?: string;
    planId?: string;
    showAllDetail?: boolean;
    isExhausted?: boolean;
    isActive?: boolean;
  }) => {
    const whereConditions = [];
    if (body.schoolId) {
      whereConditions.push(eq(notifPlanInstance_Table.schoolId, body.schoolId));
    }
    if (body.id) {
      whereConditions.push(eq(notifPlanInstance_Table.id, body.id));
    }
    if (body.planId) {
      whereConditions.push(eq(notifPlanInstance_Table.planId, body.planId));
    }
    // if (body.isExhausted) {
    whereConditions.push(
      eq(notifPlanInstance_Table.isExhausted, body.isExhausted || false)
    );
    // }
    if (body.isActive) {
      whereConditions.push(eq(notifPlanInstance_Table.isActive, body.isActive));
    }

    return await db.query.notifPlanInstance_Table.findMany({
      where: and(...whereConditions),
      orderBy: (t) => sql`${t.createdAt} asc`,
      columns: {
        planId: false,
        schoolId: false,
      },
      ...(body.showAllDetail && {
        with: {
          transaction: {
            columns: {
              planInstanceId: false,
            },
            with: {
              purchasedBy: {
                columns: {
                  id: true,
                  role: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          purchasedChannels: {
            // where: eq(notifPurchasedChannelWise_Table.isExhausted, false),
            columns: {
              planInstanceId: false,
            },
          },
        },
      }),
    });
  };

  static purchasePlanForSchool = async (
    adminId: string,
    body: PurchaseNotificationPlanBySystemAdmin_Type["body"]
  ) => {
    const { schoolId, planId, price } = body;
    const schoolDetails = await Services.School.getAllSchoolsDetails(schoolId);
    if (
      !schoolDetails ||
      schoolDetails.length === 0 ||
      schoolDetails[0]?.isDeleted
    ) {
      throw new Error("School not exists with the given Id");
    } else if (!schoolDetails[0]?.isApproved) {
      throw new Error("School is not approved yet!");
    } else if (schoolDetails[0].isSuspended) {
      throw new Error("School is suspended currently!");
    }
    const { users } = schoolDetails[0];
    const schoolSuperAdminId = users[0]?.id;
    const planDetailsArray = await this.getAllNotificationPlans({ planId });
    if (!planDetailsArray || planDetailsArray.length === 0) {
      throw new Error("Plan not exists");
    } else if (!planDetailsArray[0]?.isActive) {
      throw new Error("Given plan status is not active anymore");
    }
    const planDetails = planDetailsArray[0];

    return await db.transaction(async (tx) => {
      const newPlanInstance = {
        planId,
        schoolId,
        key: planDetails.key,
        name: planDetails.name,
        description: planDetails.description,
        metadata: planDetails.metadata,
      };

      const createPlanInstance = await tx
        .insert(notifPlanInstance_Table)
        .values(newPlanInstance)
        .returning();

      console.dir({ createPlanInstance }, { depth: null });
      const planInstanceId = createPlanInstance[0]?.id!;

      const planTransactionObj = {
        planInstanceId,
        purchasedBy: schoolSuperAdminId,
        totalPrice: price ?? planDetails.basePrice,
        paymentProvider: "CASH",
        status: Constants.NOTIFICATION.BILLING.PURCHASE_STATUS.SUCCEEDED,
        requestedActivateAt: new Date(),
      };

      const purchaseTrans = await tx
        .insert(notifPlanTrans_Table)
        .values(planTransactionObj)
        .returning();

      console.dir({ purchaseTrans }, { depth: null });

      const transactionId = purchaseTrans[0]?.id;
      const { feature } = planDetails;

      for (const f of feature) {
        const channelWiseObj = {
          planInstanceId,
          channel: f.channel,
          unitsTotal: f.units,
          limits: f.featureLimit,
          metadata: f.metadata,
        };
        const channelWiseData = await tx
          .insert(notifPurchasedChannelWise_Table)
          .values(channelWiseObj)
          .returning();
        console.dir({ channelWiseData }, { depth: null });
      }
      await Services.Notification.addLogsIntoSchoolLedger(
        {
          schoolId,
          planInstanceId,
          operation:
            Constants.NOTIFICATION.BILLING.LEDGER_REASON.SUBSCRIPTION_PURCHASED,
        },
        tx
      );
      return await this.getPlanInstances({
        schoolId,
        showAllDetail: true,
        id: planInstanceId,
      });
    });
  };

  static addCreditsToSystemInventory = async (body: {
    channel: NOTIFICATION_CHANNEL_TYPES;
    provider: NOTIFICATION_CHANNEL_PROVIDERS_TYPES;
    providerInvoiceId?: string | undefined;
    unitsPurchased: number;
    metadata: any;
  }) => {
    return await db
      .insert(notifiSystemInventory_Table)
      .values({
        ...body,
        isActive: true,
      })
      .returning();
  };

  static updateSystemInventoryLimits = async (metadata: any, id: string) => {
    return await db
      .update(notifiSystemInventory_Table)
      .set({
        metadata,
        updatedAt: new Date(),
      })
      .where(eq(notifiSystemInventory_Table.id, id))
      .returning();
  };

  static getSystemInventory = async (body: {
    active?: boolean;
    channel?: NOTIFICATION_CHANNEL_TYPES;
  }) => {
    const whereConditions = [];
    if (body.active) {
      whereConditions.push(eq(notifiSystemInventory_Table.isActive, true));
    }
    if (body.channel) {
      whereConditions.push(
        eq(notifiSystemInventory_Table.channel, body.channel)
      );
    }
    return await db.query.notifiSystemInventory_Table.findMany({
      where: and(...whereConditions),
    });
  };

  static notifChannelUsageLimit = async (body: {
    schoolId?: string | undefined;
    channel: NOTIFICATION_CHANNEL_TYPES;
    frequency: DATE_RANGE_TYPES;
    limit: number;
  }) => {
    const isForCurrent = await this.getNotifChannelUsageLimit({
      schoolId: body.schoolId,
      frequency: body.frequency,
      channel: body.channel,
    });
    if (isForCurrent.length > 0) {
      throw new Error(
        `Limit for ${body.frequency} is already set for the given organization`
      );
    }
    return await db
      .insert(notifChannelUsageLimit_Table)
      .values({
        ...body,
        orgType: body.schoolId
          ? Constants.ORGANIZATION.SCHOOL
          : Constants.ORGANIZATION.SYSTEM,
      })
      .returning();
  };

  static getNotifChannelUsageLimit = async (body: {
    schoolId?: string | undefined;
    orgType?: ORGANIZATION_TYPES;
    channel?: NOTIFICATION_CHANNEL_TYPES;
    frequency?: DATE_RANGE_TYPES;
  }) => {
    const whereConditions = [];
    if (body.schoolId) {
      whereConditions.push(
        eq(notifChannelUsageLimit_Table.schoolId, body.schoolId)
      );
    }
    if (body.orgType) {
      whereConditions.push(
        eq(notifChannelUsageLimit_Table.orgType, body.orgType)
      );
    }
    if (body.channel) {
      whereConditions.push(
        eq(notifChannelUsageLimit_Table.channel, body.channel)
      );
    }
    if (body.frequency) {
      whereConditions.push(
        eq(notifChannelUsageLimit_Table.frequency, body.frequency)
      );
    }
    return await db.query.notifChannelUsageLimit_Table.findMany({
      where: and(...whereConditions),
      orderBy: (t) => sql`${t.createdAt} asc`,
    });
  };

  static notifChannelLimitUpdate = async (body: {
    id: string;
    limit: number;
  }) => {
    return await db
      .update(notifChannelUsageLimit_Table)
      .set({
        limit: body.limit,
      })
      .where(and(eq(notifChannelUsageLimit_Table.id, body.id)))
      .returning();
  };
}
