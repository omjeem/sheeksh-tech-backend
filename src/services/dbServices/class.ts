import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { classesTable } from "@/db/schema";

export class Classes {
  static create = async (schoolId: string, name: string) => {
    const isAlreadyExists = await db.query.classesTable.findMany({
      where: and(
        eq(classesTable.schoolId, schoolId),
        eq(classesTable.name, name),
        eq(classesTable.isDeleted, false)
      ),
    });
    if(isAlreadyExists.length > 0){
        throw new Error("Class with this name already exists")
    }
    return await db
      .insert(classesTable)
      .values({
        schoolId,
        name,
      })
      .returning({
        id : classesTable.id,
        name : classesTable.name
      });
  };

  static get = async (schoolId: string) => {
    return await db.query.classesTable.findMany({
      where: eq(classesTable.schoolId, String(schoolId)),
      columns : {
        id : true,
        name : true
      }
    });
  };
}
