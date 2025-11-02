import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";

export class School {
  static createSchool = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const school = await Services.School.create(body);
      return successResponse(
        res,
        201,
        "School registration successful. Awaiting verification.",
        school
      );
    } catch (error: any) {
      console.error("School Onboarding Error:", error);
      return errorResponse(res, 400, error?.message || error);
    }
  };
}
