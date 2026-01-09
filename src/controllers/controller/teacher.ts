import { Request, Response } from "express";
import { errorResponse, successResponse } from "@/config/response";
import Services from "@/services";
import Constants from "@/config/constants";

export class Teacher {
  static create = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const responseData = await Services.Teacher.createTeachers(
        schoolId,
        req.body
      );

      return successResponse(
        res,
        "All Teachers created successfully",
        responseData,
        Constants.STATUS_CODE.CREATED
      );
    } catch (error: any) {
      console.log("Error while creating teachers", error);
      return errorResponse(res, error.message || error);
    }
  };

  static getAllTeachers = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const { pageNo = 1, limit = 50 } = req.query;
      const data = await Services.Teacher.getData(pageNo, limit, schoolId);
      return successResponse(
        res,
        "Teachers details fetched successfully",
        data
      );
    } catch (error: any) {
      console.log("Error while getting teachers deatils", error);
      return errorResponse(res, error.message || error);
    }
  };

  static getTeacherClassSectionMap = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const body = req.query;
      const data = await Services.Teacher.getteacherClassSectionMap(
        body,
        schoolId
      );
      return successResponse(
        res,
        "Teachers Mapped Data fetched Successfully",
        data
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static teacherClassSectionMap = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const body = req.body;
      await Services.School.isSchoolExistsAndActive(schoolId);
      const data = await Services.Teacher.teacherClassSectionMap(
        body,
        schoolId
      );
      return successResponse(
        res,
        "Teacher Mapped with classes Successfully",
        data
      );
    } catch (error: any) {
      console.log(error);
      return errorResponse(res, error.message || error);
    }
  };
}
