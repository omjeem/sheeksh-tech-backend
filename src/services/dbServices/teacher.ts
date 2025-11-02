import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../config/db";
import {
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
    schoolId: string,
    allData: boolean = false
  ) => {
    const conditions = [eq(teacherClassSubjectSectionTable.schoolId, schoolId)];

    if (!allData) {
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
                id: true,
                firstName: true,
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
    }[],
    schoolId: string
  ) => {
    const dataToFeed = data.map((d) => {
      const date = Utils.toUTCFromIST(d.fromDate);
      if (!date) {
        throw new Error(
          `Invalid date format ${d.fromDate} of ${String(JSON.stringify(d))}`
        );
      }
      return {
        ...d,
        fromDate: date,
        schoolId: schoolId,
      };
    });
    return await db
      .insert(teacherClassSubjectSectionTable)
      .values(dataToFeed)
      .returning();
    // const teachersIds = data.map((d) => d.teacherId);
    // const classIds = data.map((d) => d.classId);
    // const sessionIds = data.map((d) => d.sessionId);
    // const sectionIds = data.map((d) => d.sectionId);
    // const subjectIds = data.map((d) => d.subjectId);

    // const teachers = await db.query.teachersTable.findMany({
    //   where: and(
    //     inArray(teachersTable.id, teachersIds),
    //     eq(teachersTable.schoolId, schoolId)
    //   ),
    //   columns: {
    //     id: true,
    //   },
    // });
  };
}
