import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import { db } from "../../config/db";
import { sessionsTable } from "../../config/schema";
import { eq } from "drizzle-orm";
import { Utils } from "../../utils/dateTime";
import Services from "../../services";

interface SessionCreate {
  schoolId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export class Session {
  static create = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const { name, startDate, endDate, isActive } = data;
      const schoolId = req.user.schoolId;
      const sessionData = await Services.Session.create(
        schoolId,
        name,
        startDate,
        endDate
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

  static getAll = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const sessions = await Services.Session.get(schoolId);
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
