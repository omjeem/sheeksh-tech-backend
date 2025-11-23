import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";

export class Student {
  static feedStudents = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const schoolId = req.user.schoolId;
      const data = await Services.Student.feedStudent(schoolId, body);
      return successResponse(res, 201, "Student Feed Successfully");
    } catch (error: any) {
      console.log("Error while feeding user data", error);
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getLastSrNo = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const data = await Services.Student.getLastSrNo(schoolId);
      return successResponse(res, 200, "Last Sr no of Student", data);
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getStudents = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const data = await Services.Student.getStudentBySchoolId(schoolId);
      return successResponse(
        res,
        200,
        "Students data fetched successfully",
        data
      );
    } catch (error: any) {
      console.log("Error while fetching students", error);
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getStudentClassData = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const query = req.query;
      const data = await Services.Student.getStudentClassData(schoolId, query);
      // console.log({ data });
      return successResponse(res, 200, "Student class data", data);
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };
}
