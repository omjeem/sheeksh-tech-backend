import { and, eq } from "drizzle-orm";
import { db } from "../../config/db";
import { subjectsTable } from "../../config/schema";

export class Subject {
  static create = async (subject: string, schoolId: string) => {
    const isAlreadyExists = await db.query.subjectsTable.findMany({
      where: and(
        eq(subjectsTable.schoolId, schoolId),
        eq(subjectsTable.subject, subject),
        eq(subjectsTable.isDeleted, false)
      ),
    });
    if (isAlreadyExists.length > 0) {
      throw new Error("Subject with this name is Already Exists");
    }
    return await db
      .insert(subjectsTable)
      .values({
        schoolId,
        subject,
      })
      .returning();
  };

  static get = async (schoolId: string) => {
    return await db.query.subjectsTable.findMany({
      where: and(
        eq(subjectsTable.schoolId, schoolId),
        eq(subjectsTable.isDeleted, false)
      ),
      columns : {
        id : true,
        subject : true
      }
    });
  };
}
