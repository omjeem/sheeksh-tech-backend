import { Request, Response } from "express";
import { errorResponse, sqlErrors, successResponse } from "@/config/response";
import Services from "@/services";
import Constants from "@/config/constants";

export class Class {
  static create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const schoolId = req.user.schoolId;
      const classData = await Services.Classes.create(schoolId, name);
      return successResponse(
        res,
        "Class created Successfully",
        classData,
        Constants.STATUS_CODE.CREATED
      );
    } catch (error: any) {
      return errorResponse(
        res,
        sqlErrors(error)
      );
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const allClasses = await Services.Classes.get(schoolId);
      return successResponse(
        res,
        "All Classes fetched successfully",
        allClasses
      );
    } catch (error: any) {
      return errorResponse(
        res,
        error.message || error
      );
    }
  };
}
