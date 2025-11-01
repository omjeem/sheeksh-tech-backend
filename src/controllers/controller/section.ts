import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import { db } from "../../config/db";
import { sectionsTable } from "../../config/schema";
import { eq } from "drizzle-orm";

export class Section {
  static create = async (req: Request, res: Response) => {
    try {
      const { classId, name } = req.body;
      const schoolId = req.user.schoolId;
      const sesctionData = await db
        .insert(sectionsTable)
        .values({
          schoolId,
          classId,
          name,
        })
        .returning();
      return successResponse(
        res,
        200,
        "Section created Successfully",
        sesctionData
      );
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const { classId } = req.params;
      const sectionsData = await db.query.sectionsTable.findMany({
        where: eq(sectionsTable.classId, String(classId)),
      });
      return successResponse(
        res,
        200,
        "All Sections fetched successfully",
        sectionsData
      );
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };
}
