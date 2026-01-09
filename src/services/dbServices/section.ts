import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { classesTable, sectionsTable } from "@/db/schema";

export class Section {
  static create = async (schoolId: string, classId: string, name: string) => {
    const isClassAndSchool = await db.query.classesTable.findFirst({
      where : and(
        eq(classesTable.schoolId, schoolId),
        eq(classesTable.id, classId)
      )
    })
    if(!isClassAndSchool){
      throw new Error("This class is not associated with this school")
    }
    const isAlreadyExists = await db.query.sectionsTable.findMany({
      where: and(
        eq(sectionsTable.schoolId, schoolId),
        eq(sectionsTable.classId, classId),
        eq(sectionsTable.name, name),
        eq(sectionsTable.isDeleted, false)
      ),
    });
    if (isAlreadyExists.length > 0) {
      throw new Error(
        `Section with this name of this particular class already exists`
      );
    }
    return await db
      .insert(sectionsTable)
      .values({
        schoolId,
        classId,
        name,
      })
      .returning();
  };

  static get = async (classId: string, schoolId: string) => {
    return await db.query.sectionsTable.findMany({
      where: and(
        eq(sectionsTable.classId, classId),
        eq(sectionsTable.schoolId, schoolId)
      ),
      columns: {
        id: true,
        name: true,
      },
    });
  };
}
