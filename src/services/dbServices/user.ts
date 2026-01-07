import { and, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "../../config/db";
import {
  studentClassesTable,
  studentsTable,
  teacherClassSubjectSectionTable,
  teachersTable,
  usersTable,
} from "../../config/schema";
import { UserRolesType } from "../../types/types";
import { UsersTable_Type } from "../../config/schemaTypes";
import { Utils } from "../../utils";
import { BulkUserSearch } from "../../validators/types";

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
    // if (!Utils.verifyPassword(password, email, userDetails.password)) {
    //   throw new Error("Invalid password");
    // }
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

  static studentSearch = async (
    schoolId: string,
    body: Omit<BulkUserSearch["body"], "type">
  ) => {
    const whereConditions: any = [eq(studentClassesTable.schoolId, schoolId)];
    if (body.classId) {
      whereConditions.push(eq(studentClassesTable.classId, body.classId));
    }
    if (body.sectionId) {
      whereConditions.push(eq(studentClassesTable.sectionId, body.sectionId));
    }
    if (body.sessionId) {
      whereConditions.push(eq(studentClassesTable.sessionId, body.sessionId));
    }
    if (body.studentId) {
      whereConditions.push(eq(studentClassesTable.studentId, body.studentId));
    }
    if (body.searchQuery) {
      const pattern = `%${body.searchQuery}%`;
      console.log({ pattern });
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
      .from(studentClassesTable)
      .leftJoin(
        studentsTable,
        eq(studentClassesTable.studentId, studentsTable.id)
      )
      .leftJoin(usersTable, eq(studentsTable.userId, usersTable.id))
      .where(and(...whereConditions));
  };

  static teacherSearch = async (
    schoolId: string,
    body: Omit<BulkUserSearch["body"], "type">
  ) => {
    const whereConditions: any = [
      eq(teacherClassSubjectSectionTable.schoolId, schoolId),
    ];
    if (body.classId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.classId, body.classId)
      );
    }
    if (body.sectionId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.sectionId, body.sectionId)
      );
    }
    if (body.sessionId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.sessionId, body.sessionId)
      );
    }
    if (body.subjectId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.subjectId, body.subjectId)
      );
    }
    if (body.teacherId) {
      whereConditions.push(
        eq(teacherClassSubjectSectionTable.teacherId, body.teacherId)
      );
    }
    if (body.searchQuery) {
      const pattern = `%${body.searchQuery}%`;
      console.log({ pattern });
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
      .where(and(...whereConditions));
  };
}
