import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";
import Constants from "../../config/constants";

export class Section {
  static create = async (req: Request, res: Response) => {
    try {
      const { classId, name } = req.body;
      const schoolId = req.user.schoolId;
      const sesctionData = await Services.Section.create(
        schoolId,
        classId,
        name
      );
      return successResponse(
        res,
        "Section created Successfully",
        sesctionData,
        Constants.STATUS_CODE.CREATED
      );
    } catch (error: any) {
      return errorResponse(
        res,
        error.message || error
      );
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const { classId } = req.params;
      const schoolId = req.user.schoolId;
      const sectionsData = await Services.Section.get(
        String(classId),
        schoolId
      );
      return successResponse(
        res,
        "All Sections fetched successfully",
        sectionsData
      );
    } catch (error: any) {
      return errorResponse(
        res,
        error.message || error
      );
    }
  };
}
