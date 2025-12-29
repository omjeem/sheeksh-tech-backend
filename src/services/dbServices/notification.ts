import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../config/db";
import { notificationCategory_Table } from "../../config/schema";

export class Notification {
  static createCategory = async (body: {
    schoolId: string;
    userId: string;
    categories: [string];
  }) => {
    const categoriesArray = body.categories;

    const isCategoryExists = await db
      .select({ category: notificationCategory_Table.category })
      .from(notificationCategory_Table)
      .where(
        and(
          inArray(notificationCategory_Table.category, categoriesArray),
          eq(notificationCategory_Table.schoolId, body.schoolId),
          eq(notificationCategory_Table.isDeleted, false)
        )
      );

    if (isCategoryExists.length > 0) {
      throw new Error(
        `Categories already exists - ${isCategoryExists
          .map((c) => c.category)
          .join(" | ")}`
      );
    }

    const values = body.categories.map((c) => ({
      schoolId: body.schoolId,
      createdBy: body.userId,
      category: c,
    }));

    console.log({ values });
    return await db
      .insert(notificationCategory_Table)
      .values(values)
      .returning({
        id: notificationCategory_Table.id,
        category: notificationCategory_Table.category,
      });
  };

  static getAllCategories = async (schoolId: string) => {
    return await db.query.notificationCategory_Table.findMany({
      where: and(
        eq(notificationCategory_Table.isDeleted, false),
        eq(notificationCategory_Table.schoolId, schoolId)
      ),
      columns: {
        id: true,
        category: true,
        createdAt: true,
      },
    });
  };
}
