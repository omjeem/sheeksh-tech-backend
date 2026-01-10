import { SYSTEM_ADMIN_ACCESS_TYPES } from "@/config/constants";
import { db } from "@/db";
import {
  notifPlanFeatureLimit_Table,
  notifPlanFeatures_Table,
  notifPlans_Table,
  systemAdmin_Table,
} from "@/db/schema";
import { PostgressTransaction_Type } from "@/types/types";
import { Utils } from "@/utils";
import { and, eq } from "drizzle-orm";
import Services from "..";
import { CreateNotificationPlan_Type } from "@/validators/types";

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
      return await this.getAllNotificationPlans(planId);
    });
  };

  static getAllNotificationPlans = async (planId?: string) => {
    const whereConditions = [];
    if (planId) {
      whereConditions.push(eq(notifPlans_Table.id, planId));
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
}
