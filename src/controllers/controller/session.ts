import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";

export class Session {
  static create = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const schoolId = req.user.schoolId;
      const { name, isActive } = data;

      const [startYear, endYear] = name.split("-").map(Number);
      const startDate = new Date(startYear, 3, 1);
      const endDate = new Date(endYear, 2, 31);

      const sessionData = await Services.Session.create(
        schoolId,
        name,
        startDate,
        endDate,
        isActive
      );

      return successResponse(
        res,
        201,
        "Session Created Successfully",
        sessionData
      );
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };

  static changeSessionStatus = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const { sessionId, status } = req.body;
      await Services.Session.changeSessionActiveState(
        sessionId,
        schoolId,
        status
      );
      return successResponse(res, 200, "Session updated Successfully");
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const { active }: any = req.query;
      const sessions = await Services.Session.get(schoolId, active);
      return successResponse(
        res,
        200,
        "Session Fetched Successfully",
        sessions
      );
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };
}
