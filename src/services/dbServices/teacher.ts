import { eq, sql } from "drizzle-orm";
import { db } from "../../config/db";
import { teachersTable } from "../../config/schema";

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
}
