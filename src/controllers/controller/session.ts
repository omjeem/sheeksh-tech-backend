import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import { db } from "../../config/db";
import { sessionsTable } from "../../config/schema";
import { eq } from "drizzle-orm";
import { Utils } from "../../utils/dateTime";

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
      const { schoolId, name, startDate, endDate, isActive } = data;
      
      const start = Utils.toUTCFromIST(startDate);
      const end = Utils.toUTCFromIST(endDate);

      const session = await db
        .insert(sessionsTable)
        .values({
          schoolId,
          name,
          startDate: start,
          endDate: end,
          isActive: true,
        })
        .returning();

      return successResponse(res, 201, "Session Created Successfully", session);
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.params;
      const sessions = await db.query.sessionsTable.findMany({
        where: eq(sessionsTable.schoolId, String(schoolId)),
      });
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
