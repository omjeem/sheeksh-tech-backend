import { SYSTEM_ADMIN_ACCESS_TYPES } from "@/config/constants";
import { db } from "@/db";
import { systemAdmin_Table } from "@/db/schema";
import { Utils } from "@/utils";
import { eq } from "drizzle-orm";

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
}
