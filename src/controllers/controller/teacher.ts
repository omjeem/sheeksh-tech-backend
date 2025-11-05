import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import { schoolsTable, teachersTable, usersTable } from "../../config/schema";
import { db } from "../../config/db";
import { eq } from "drizzle-orm";
import { Utils } from "../../utils/dateTime";
import Services from "../../services";
import { TeacherDesignation, UserRoles } from "../../types/types";
import { CreateTeachers_Type } from "../../validators/validator/teacher";


export class Teacher {
  static create = async (req: Request, res: Response) => {
    try {
      const teachersData: CreateTeachers_Type = req.body;
      const schoolId = req.user.schoolId;
      const isSchool = await db.query.schoolsTable.findFirst({
        where: eq(schoolsTable.id, schoolId),
      });

      if (!isSchool) {
        throw new Error("School not exists");
      }

      const emails = teachersData.map((d) => d.email);
      await Services.User.isUsersExists(emails);

      const responseData = await db.transaction(async (tx) => {
        console.log({ teachersData });
        const userData = teachersData.map((d) => {
          return {
            schoolId: schoolId,
            email: d.email,
            password: d.password || `${d.email + "-" + d.dateOfBirth}`,
            role: UserRoles.TEACHER,
            dateOfBirth: Utils.toUTCFromIST(d.dateOfBirth),
            firstName: d.firstName,
            lastName: d.lastName,
          };
        });
        const usersResponse = await tx
          .insert(usersTable)
          .values(userData)
          .returning({
            userId: usersTable.id,
          });
        // console.log({ usersResponse });
        const teachersDataTofeed = usersResponse.map((d, i) => {
          return {
            userId: d.userId,
            schoolId,
            startDate: Utils.toUTCFromIST(teachersData[i]?.startDate),
            endDate: Utils.toUTCFromIST(teachersData[i]?.endDate),
            designation: teachersData[i]!.designation,
          };
        });
        // console.log({ teachersDataTofeed });
        const teacherDataResponse = await tx
          .insert(teachersTable)
          .values(teachersDataTofeed)
          .returning();

        return teacherDataResponse;
      });

      return successResponse(
        res,
        201,
        "All Teachers created successfully",
        responseData
      );
    } catch (error: any) {
      console.log("Error while creating teachers", error);
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getAllTeachers = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const { pageNo = 1, limit = 10 } = req.query;
      const data = await Services.Teacher.getData(pageNo, limit, schoolId);
      return successResponse(
        res,
        200,
        "Teachers details fetched successfully",
        data
      );
    } catch (error: any) {
      console.log("Error while getting teachers deatils", error);
      return errorResponse(res, 400, error.message || error);
    }
  };

  static getTeacherClassSectionMap = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const body = req.body;
      const data = await Services.Teacher.getteacherClassSectionMap(
        body,
        schoolId,
      );
      return successResponse(
        res,
        200,
        "Teachers Mapped Data fetched Successfully",
        data
      );
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
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
        201,
        "Teacher Mapped with classes Successfully",
        data
      );
    } catch (error: any) {
      console.log(error);
      return errorResponse(res, 400, error.message || error);
    }
  };
}
