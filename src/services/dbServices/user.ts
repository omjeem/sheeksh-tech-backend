import { and, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  studentClassSectionTable,
  studentsTable,
  teacherClassSubjectSectionTable,
  teachersTable,
  userGuardiansTable,
  usersTable,
} from "@/db/schema";
import { UserRolesType } from "@/types/types";
import { UsersTable_Type } from "@/db/types";
import { BulkUserSearch, UserGuardianMap_Type } from "@/validators/types";
import { Utils } from "@/utils";
import Constants, { GUARDIANS_TYPES } from "@/config/constants";

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
    data: Omit<UsersTable_Type, "id" | "createdAt" | "updatedAt">[],
    tx?: any
  ) => {
    const dbObj = tx ?? db;
    const emails = data.map((d) => d.email);
    await this.isUsersExists(emails);
    return await dbObj.insert(usersTable).values(data).returning({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      role: usersTable.role,
      email: usersTable.email,
      phone: usersTable.phone,
    });
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
      role: userDetails.role as UserRolesType,
      userId: userDetails.id,
    };
  };

  static getBulkUserInfo = async (users: string[], schoolId: string) => {
    return await db.query.usersTable.findMany({
      where: and(
        eq(usersTable.schoolId, schoolId),
        inArray(usersTable.id, users)
      ),
      columns: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        role: true,
      },
    });
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

  static studentSearch = async (body: {
    schoolId: string;
    searchObj: Omit<BulkUserSearch["body"], "type">;
    offSet: number;
    limit: number;
  }) => {
    const whereConditions: any = [
      eq(studentClassSectionTable.schoolId, body.schoolId),
    ];
    if (body.searchObj.classId) {
      whereConditions.push(
        eq(studentClassSectionTable.classId, body.searchObj.classId)
      );
    }
    if (body.searchObj.sectionId) {
      whereConditions.push(
        eq(studentClassSectionTable.sectionId, body.searchObj.sectionId)
      );
    }
    if (body.searchObj.sessionId) {
      whereConditions.push(
        eq(studentClassSectionTable.sessionId, body.searchObj.sessionId)
      );
    }
    if (body.searchObj.studentId) {
      whereConditions.push(
        eq(studentClassSectionTable.studentId, body.searchObj.studentId)
      );
    }
    if (body.searchObj.searchQuery) {
      const pattern = `%${body.searchObj.searchQuery}%`;
      // console.log({ pattern });
      whereConditions.push(
        or(
          sql`LOWER(${usersTable.firstName}) LIKE LOWER(${pattern})`,
          sql`LOWER(${usersTable.lastName}) LIKE LOWER(${pattern})`,
          sql`LOWER(${usersTable.email}) LIKE LOWER(${pattern})`
        )
      );
    }
    return await db
      .select({
        studentId: studentsTable.id,
        userId: usersTable.id,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        email: usersTable.email,
      })
      .from(studentClassSectionTable)
      .leftJoin(
        studentsTable,
        eq(studentClassSectionTable.studentId, studentsTable.id)
      )
      .leftJoin(usersTable, eq(studentsTable.userId, usersTable.id))
      .where(and(...whereConditions))
      .limit(body.limit)
      .offset(body.offSet);
  };

  static teacherSearch = async (body: {
    schoolId: string;
    searchObj: Omit<BulkUserSearch["body"], "type">;
    offSet: number;
    limit: number;
  }) => {
    const whereConditions: any = [
      eq(teacherClassSubjectSectionTable.schoolId, body.schoolId),
    ];
    if (body.searchObj.classId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.classId, body.searchObj.classId)
      );
    }
    if (body.searchObj.sectionId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.sectionId, body.searchObj.sectionId)
      );
    }
    if (body.searchObj.sessionId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.sessionId, body.searchObj.sessionId)
      );
    }
    if (body.searchObj.subjectId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.subjectId, body.searchObj.subjectId)
      );
    }
    if (body.searchObj.teacherId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.teacherId, body.searchObj.teacherId)
      );
    }
    if (body.searchObj.searchQuery) {
      const pattern = `%${body.searchObj.searchQuery}%`;
      // console.log({ pattern });
      whereConditions.push(
        or(
          sql`LOWER(${usersTable.firstName}) LIKE LOWER(${pattern})`,
          sql`LOWER(${usersTable.lastName}) LIKE LOWER(${pattern})`,
          sql`LOWER(${usersTable.email}) LIKE LOWER(${pattern})`
        )
      );
    }
    return await db
      .select({
        teacherId: teachersTable.id,
        userId: usersTable.id,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        email: usersTable.email,
      })
      .from(teacherClassSubjectSectionTable)
      .leftJoin(
        teachersTable,
        eq(teacherClassSubjectSectionTable.teacherId, teachersTable.id)
      )
      .leftJoin(usersTable, eq(teachersTable.userId, usersTable.id))
      .where(and(...whereConditions))
      .limit(body.limit)
      .offset(body.offSet);
  };

  static userSearch = async (body: {
    schoolId: string;
    searchObj: Omit<BulkUserSearch["body"], "type">;
    offSet: number;
    limit: number;
  }) => {
    const whereConditions: any = [eq(usersTable.schoolId, body.schoolId)];
    if (body.searchObj.searchQuery) {
      const pattern = `%${body.searchObj.searchQuery}%`;
      // console.log({ pattern });
      whereConditions.push(
        or(
          sql`LOWER(${usersTable.firstName}) LIKE LOWER(${pattern})`,
          sql`LOWER(${usersTable.lastName}) LIKE LOWER(${pattern})`,
          sql`LOWER(${usersTable.email}) LIKE LOWER(${pattern})`
        )
      );
    }
    if (body.searchObj.role) {
      whereConditions.push(eq(usersTable.role, body.searchObj.role));
    }
    return await db
      .select({
        userId: usersTable.id,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(and(...whereConditions))
      .limit(body.limit)
      .offset(body.offSet);
  };

  static getGuardians = async (body: { schoolId: string; userId: string }) => {
    const getUserInfo = {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      role: true,
    };
    return await db.query.usersTable.findFirst({
      where: and(
        eq(usersTable.id, body.userId),
        eq(usersTable.schoolId, body.schoolId)
      ),
      columns: {
        ...getUserInfo,
      },
      with: {
        guardian: {
          columns: {
            isPrimary: true,
            relation: true,
          },
          with: {
            guardian: {
              columns: {
                ...getUserInfo,
              },
            },
          },
        },
        children: {
          columns: {
            isPrimary: true,
            relation: true,
          },
          with: {
            children: {
              columns: {
                ...getUserInfo,
              },
            },
          },
        },
      },
    });
  };

  static getAllUserGuardians = async (body: {
    schoolId: string;
    childUserId?: string;
    guardianUserId?: string;
    isPrimary?: boolean | undefined;
    isActive?: boolean | undefined;
    relation?: GUARDIANS_TYPES;
  }) => {
    const whereConditions = [eq(userGuardiansTable.schoolId, body.schoolId)];
    if (body.childUserId) {
      whereConditions.push(
        eq(userGuardiansTable.childUserId, body.childUserId)
      );
    }
    if (body.guardianUserId) {
      whereConditions.push(
        eq(userGuardiansTable.guardianUserId, body.guardianUserId)
      );
    }
    if (typeof body.isPrimary === "boolean") {
      whereConditions.push(eq(userGuardiansTable.isPrimary, body.isPrimary));
    }
    if (typeof body.isActive === "boolean") {
      whereConditions.push(eq(userGuardiansTable.isActive, body.isActive));
    }
    if (body.relation) {
      whereConditions.push(eq(userGuardiansTable.relation, body.relation));
    }
    return await db.query.userGuardiansTable.findMany({
      where: and(...whereConditions),
      columns: {
        id: true,
        childUserId: true,
        guardianUserId: true,
        isPrimary: true,
        relation: true,
      },
    });
  };

  static userGuardianRelationMap = async (body: {
    schoolId: string;
    data: UserGuardianMap_Type["body"];
  }) => {
    const childUserId = body.data.childUserId;
    const childerData = await this.getUserDetails(childUserId);
    if (!childerData) {
      throw new Error("Child User not exists!");
    }
    if (childerData.role !== Constants.USER_ROLES.STUDENT) {
      throw new Error(
        `Given Child user is not student type but ${childerData.role} type`
      );
    }
    const allGuardiansId = body.data.guardians.map((g) => g.guardianUserId);
    const getAllGuardiansInfo = await this.getBulkUserInfo(
      allGuardiansId,
      body.schoolId
    );
    if (allGuardiansId.length !== getAllGuardiansInfo.length) {
      throw new Error(
        `${
          allGuardiansId.length - getAllGuardiansInfo.length
        } guardians records not dound`
      );
    }
    const nonGuardiansRoles: string[] = [];
    getAllGuardiansInfo.forEach((g) => {
      if (g.role !== Constants.USER_ROLES.GUARDIAN) {
        nonGuardiansRoles.push(g.firstName);
      }
    });
    if (nonGuardiansRoles.length > 0) {
      throw new Error(
        `These users are not type of ${
          Constants.USER_ROLES.GUARDIAN
        } ${nonGuardiansRoles.join(" | ")}`
      );
    }
    const primaryGuardians = await this.getAllUserGuardians({
      schoolId: body.schoolId,
      childUserId,
      isPrimary: true,
    });
    const isUserHavePrimaryGuardian = primaryGuardians.length > 0;
    const dataToFeed = body.data.guardians.map((g, index) => {
      const isPrimary = !isUserHavePrimaryGuardian && index <= 1 ? true : false;
      return {
        schoolId: body.schoolId,
        childUserId,
        guardianUserId: g.guardianUserId,
        relation: g.relation,
        isPrimary,
      };
    });
    return await db.insert(userGuardiansTable).values(dataToFeed).returning();
  };
}
