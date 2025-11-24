import { eq, inArray } from "drizzle-orm";
import { db } from "../../config/db";
import { usersTable } from "../../config/schema";
import { UserRolesType } from "../../types/types";
import { UsersTable_Type } from "../../config/schemaTypes";
import { Utils } from "../../utils";

export class User {
  static isUsersExists = async (emails: string[]) => {
    const existingEmails = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(inArray(usersTable.email, emails));

    if (existingEmails.length > 0) {
      const duplicateEmails = existingEmails.map((e) => e.email).join(", ");
      throw new Error(`Duplicate emails found: ${duplicateEmails}`);
    }
  };

  static addNewUsers = async (
    data: [Omit<UsersTable_Type, "id" | "createdAt" | "updatedAt">],
    tx: any
  ) => {
    const emails = data.map((d) => d.email);
    await this.isUsersExists(emails);
    return await tx.insert(usersTable).values(data).returning();
  };

  static validateUserIdAndPassword = async (
    email: string,
    password: string
  ): Promise<{
    schoolId: string;
    role: UserRolesType;
    userId: string;
  }> => {
    const userDetails = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
      columns: {
        id: true,
        schoolId: true,
        email: true,
        password: true,
        isSuspended: true,
        role: true,
      },
    });
    if (!userDetails) {
      throw new Error("Invalid user Email");
    }
    console.log({ password });
    if (!Utils.verifyPassword(password, email, userDetails.password)) {
      throw new Error("Invalid password");
    }
    if (userDetails.isSuspended) {
      throw new Error(
        "Your account is being suspended please contact your organization admin!"
      );
    }
    return {
      schoolId: userDetails.schoolId,
      role: userDetails.role,
      userId: userDetails.id,
    };
  };

  static getUserDetails = async (userId: string) => {
    return await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      columns: {
        id: true,
        role: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  };
}
