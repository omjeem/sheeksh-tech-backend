import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import { db } from "../../config/db";
import { classesTable } from "../../config/schema";
import { eq } from "drizzle-orm";

export class Class {
  static create = async (req: Request, res: Response) => {
    try {
      const { schoolId, name } = req.body;
      const classData = await db.insert(classesTable).values({
        schoolId,
        name,
      }).returning();
      return successResponse(res, 200, "Class created Successfully", classData);
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.params;
      const allClasses = await db.query.classesTable.findMany({
        where: eq(classesTable.schoolId, String(schoolId)),
      });
      return successResponse(
        res,
        200,
        "All Classes fetched successfully",
        allClasses
      );
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };
}
