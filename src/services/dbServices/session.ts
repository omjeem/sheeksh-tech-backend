import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { sessionsTable } from "../../config/schema";
import { Utils } from "../../utils/dateTime";

export class Session {
  static create = async (
    schoolId: string,
    name: string,
    startDate: string,
    endDate: string
  ) => {
    const start = Utils.toUTCFromIST(startDate);
    const end = Utils.toUTCFromIST(endDate);
    if (!start || !end) {
      throw new Error(
        `Start and End data should be valid Start date - ${startDate} End date - ${endDate}`
      );
    }
    return await db
      .insert(sessionsTable)
      .values({
        schoolId,
        name,
        startDate: start,
        endDate: end,
        isActive: true,
      })
      .returning();
  };

  static get = async (schoolId: string) => {
    return await db.query.sessionsTable.findMany({
      where: eq(sessionsTable.schoolId, String(schoolId)),
      columns : {
        id: true,
        name : true,
        startDate: true,
        endDate : true,
        isActive : true
      }
    });
  };
}
