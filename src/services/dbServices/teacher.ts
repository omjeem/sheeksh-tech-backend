import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../config/db";
import {
  sectionsTable,
  sessionsTable,
  subjectsTable,
  teacherClassSubjectSectionTable,
  teachersTable,
} from "../../config/schema";
import { Utils } from "../../utils/dateTime";

export class Teacher {
  static getData = async (pageNo: any, limit: any, schoolId: string) => {
    const offset = (pageNo - 1) * limit;

    // const totalData = await db
    //   .select({ count: sql<number>`count *` })
    //   .from(teachersTable)
    //   .where(eq(teachersTable.schoolId, schoolId));

    // const count = totalData[0]?.count;

    const teachers = await db.query.teachersTable.findMany({
      where: eq(teachersTable.schoolId, schoolId),
      offset,
      limit,
      columns: {
        id: true,
        startDate: true,
        endDate: true,
        designation: true,
      },
      with: {
        user: {
          columns: {
            email: true,
            dateOfBirth: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return {
      //   count,
      teachers,
    };
  };

  static getteacherClassSectionMap = async (
    queries: {
      teacherId?: string;
      classId?: string;
      sessionId?: string;
      sectionId?: string;
      subjectId?: string;
      fromDate?: string;
    },
    schoolId: string
  ) => {
    const conditions = [eq(teacherClassSubjectSectionTable.schoolId, schoolId)];

    if (queries.classId) {
      conditions.push(
        eq(teacherClassSubjectSectionTable.classId, queries.classId)
      );
    }
    if (queries.teacherId) {
      conditions.push(
        eq(teacherClassSubjectSectionTable.teacherId, queries.teacherId)
      );
    }
    if (queries.sessionId) {
      conditions.push(
        eq(teacherClassSubjectSectionTable.sessionId, queries.sessionId)
      );
    }
    if (queries.sectionId) {
      conditions.push(
        eq(teacherClassSubjectSectionTable.sectionId, queries.sectionId)
      );
    }
    if (queries.subjectId) {
      conditions.push(
        eq(teacherClassSubjectSectionTable.subjectId, queries.subjectId)
      );
    }
    // if (queries.fromDate) {
    //   conditions.push(
    //     gte(
    //       teacherClassSubjectSectionTable.fromDate,
    //       new Date(queries.fromDate)
    //     )
    //   );
    // }

    return await db.query.teacherClassSubjectSectionTable.findMany({
      where: and(...conditions),
      columns: {
        id: true,
        fromDate: true,
        endDate: true,
        isActive: true,
        createdAt: true,
      },
      with: {
        school: {
          columns: {
            name: true,
          },
        },
        subject: {
          columns: {
            id: true,
            subject: true,
          },
        },
        session: {
          columns: {
            id: true,
            name: true,
          },
        },
        section: {
          columns: {
            id: true,
            name: true,
          },
        },
        class: {
          columns: {
            id: true,
            name: true,
          },
        },
        teacher: {
          columns: {
            id: true,
          },
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  };

  static teacherClassSectionMap = async (
    data: {
      teacherId: string;
      classId: string;
      sessionId: string;
      sectionId: string;
      subjectId: string;
      fromDate: string;
    },
    schoolId: string
  ) => {
    const date = Utils.toUTCFromIST(data.fromDate);
    if (!date) {
      throw new Error(`Invalid date format ${data.fromDate}}`);
    }
    const dataToFeed = {
      ...data,
      fromDate: date,
      schoolId: schoolId,
    };
    const isClassSection = await db.query.sectionsTable.findFirst({
      where: and(
        eq(sectionsTable.id, data.sectionId),
        eq(sectionsTable.isDeleted, false)
      ),
    });
    if (!isClassSection) {
      throw new Error("Section you mentioned is not valid");
    }
    if (isClassSection.classId !== data.classId) {
      throw new Error("This section is not belongs to this class");
    }
    const isSucjectBelongs = await db.query.subjectsTable.findFirst({
      where: and(eq(subjectsTable.id, data.subjectId)),
    });
    if (!isSucjectBelongs) {
      throw new Error("This subject is not belongs to the school");
    }
    const isSessionBelongs = await db.query.sessionsTable.findFirst({
      where: and(
        eq(sessionsTable.id, data.sessionId),
        eq(sessionsTable.schoolId, schoolId)
      ),
    });
    if (!isSessionBelongs) {
      throw new Error("This session is not belongs to the school");
    }
    const isExists = await db.query.teacherClassSubjectSectionTable.findFirst({
      where: and(
        eq(teacherClassSubjectSectionTable.schoolId, schoolId),
        eq(teacherClassSubjectSectionTable.classId, data.classId),
        eq(teacherClassSubjectSectionTable.sectionId, data.sectionId),
        eq(teacherClassSubjectSectionTable.sessionId, data.sessionId),
        eq(teacherClassSubjectSectionTable.subjectId, data.subjectId),
        eq(teacherClassSubjectSectionTable.isActive, true)
      ),
    });
    if (isExists) {
      throw new Error(
        "There is already an active teacher for this class, section and subject!"
      );
    }

    return await db
      .insert(teacherClassSubjectSectionTable)
      .values(dataToFeed)
      .returning();
  };
}
