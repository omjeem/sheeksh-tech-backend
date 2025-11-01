import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../config/db";
import { schoolsTable, usersTable } from "../../config/schema";
import { UserRoles, UserRolesType } from "../../types/types";

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

  static validateUserIdAndPassword = async (
    email: string,
    password: string,
    isSuperAdmin: boolean = false
  ): Promise<{
    schoolId: string;
    role: UserRolesType;
    userId: string | null;
  }> => {
    if (isSuperAdmin) {
      const superAdminData = await db.query.schoolsTable.findFirst({
        where: eq(schoolsTable.superAdminEmail, email),
        columns: {
          id: true,
          superAdminPassword: true,
        },
      });
      if (!superAdminData) {
        throw new Error("Invalid Super Admin Email");
      }
      if (superAdminData.superAdminPassword !== password) {
        throw new Error("Invalid Password");
      }
      return {
        schoolId: superAdminData.id,
        role: UserRoles.SUPER_ADMIN,
        userId: null,
      };
    } else {
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
      if (userDetails.password !== password) {
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
    }
  };
}
