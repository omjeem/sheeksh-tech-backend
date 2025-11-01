import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";

export class Class {
  static create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const schoolId = req.user.schoolId;
      const classData = await Services.Classes.create(schoolId, name);
      return successResponse(res, 200, "Class created Successfully", classData);
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const allClasses = await Services.Classes.get(schoolId);
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
