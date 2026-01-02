import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../config/db";
import {
  notificationCategory_Table,
  notificationTemplate_Table,
} from "../../config/schema";

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

  static getCategoryById = async (categoryId: string) => {
    return await db.query.notificationCategory_Table.findFirst({
      where: and(
        eq(notificationCategory_Table.isDeleted, false),
        eq(notificationCategory_Table.id, categoryId)
      ),
    });
  };

  static createTemplate = async (body: {
    schoolId: string;
    userId: string;
    categoryId: string;
    name: string;
    payload: Object;
  }) => {
    const categoryDetail = await this.getCategoryById(body.categoryId);
    if (!categoryDetail) {
      throw new Error("Category not exists");
    }
    if (categoryDetail.schoolId !== body.schoolId) {
      throw new Error("This category is not related with your school");
    }
    return await db
      .insert(notificationTemplate_Table)
      .values({
        schoolId: body.schoolId,
        categoryId: body.categoryId,
        name: body.name,
        templatePayload: body.payload,
        createdBy: body.userId,
      })
      .returning({
        id: notificationTemplate_Table.id,
        categoryId: notificationTemplate_Table.categoryId,
        name: notificationTemplate_Table.name,
        templatePayload: notificationTemplate_Table.templatePayload,
      });
  };

  static getAllTemplate = async (
    schoolId: string,
    templateId: string | null = null
  ) => {
    const whereConditions = [
      eq(notificationTemplate_Table.isDeleted, false),
      eq(notificationTemplate_Table.schoolId, schoolId),
    ];
    if (templateId) {
      whereConditions.push(eq(notificationTemplate_Table.id, templateId));
    }
    return await db.query.notificationTemplate_Table.findMany({
      where: and(...whereConditions),
      columns: {
        id: true,
        name: true,
        templatePayload: true,
        createdAt : true,
        updatedAt : true
      },
      with: {
        category: {
          columns: {
            id: true,
            category: true,
          },
        },
      },
    });
  };

  static getTemplateByCategory = async (body: {
    categoryId: string;
    schoolId: string;
  }) => {
    return await db.query.notificationTemplate_Table.findMany({
      where: and(
        eq(notificationTemplate_Table.isDeleted, false),
        eq(notificationTemplate_Table.categoryId, body.categoryId),
        eq(notificationTemplate_Table.schoolId, body.schoolId)
      ),
      columns: {
        id: true,
        name: true,
        templatePayload: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            category: true,
          },
        },
      },
    });
  };

  static getTemplateByIdAndSchoolId = async (body: {
    schoolId: string;
    templateId: string;
  }) => {
    return await db.query.notificationTemplate_Table.findFirst({
      where: and(
        eq(notificationTemplate_Table.isDeleted, false),
        eq(notificationTemplate_Table.id, body.templateId),
        eq(notificationTemplate_Table.schoolId, body.schoolId)
      ),
    });
  };

  static updateTemplateById = async (body: {
    templateId: string;
    userId: string;
    schoolId: string;
    payload: Object;
  }) => {
    console.log({ body });
    const isBelongsToSchool = await this.getTemplateByIdAndSchoolId({
      templateId: body.templateId,
      schoolId: body.schoolId,
    });
    if (!isBelongsToSchool) {
      throw new Error("This template not exist or not belongs to this school");
    }
    return await db
      .update(notificationTemplate_Table)
      .set({
        templatePayload: body.payload,
        updatedAt: new Date(),
      })
      .where(and(eq(notificationTemplate_Table.id, body.templateId)))
      .returning({
        id: notificationTemplate_Table.id,
        name: notificationTemplate_Table.name,
        templatePayload: notificationTemplate_Table.templatePayload,
        createdAt: notificationTemplate_Table.createdAt,
        updatedAt: notificationTemplate_Table.updatedAt,
      });
  };
}
