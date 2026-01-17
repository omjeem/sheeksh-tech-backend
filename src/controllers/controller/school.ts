import { Request, Response } from "express";
import { errorResponse, successResponse } from "@/config/response";
import Services from "@/services";
import Constants from "@/config/constants";

export class School {
  static createSchool = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const school = await Services.School.create(body);
      return successResponse(
        res,
        "School registration successful. Awaiting verification.",
        school,
        Constants.STATUS_CODE.CREATED
      );
    } catch (error: any) {
      console.error("School Onboarding Error:", error);
      return errorResponse(
        res,
        error?.message || error
      );
    }
  };
}
