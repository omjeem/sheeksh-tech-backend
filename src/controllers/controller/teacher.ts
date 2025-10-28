import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import {
  schoolsTable,
  TeacherDesignation,
  teachersTable,
  UserRoles,
  usersTable,
} from "../../config/schema";
import { db } from "../../config/db";
import { eq } from "drizzle-orm";
import { Utils } from "../../utils/dateTime";

interface TeacherData {
  email: string;
  password: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  startDate: string;
  endDate: string;
  designation: TeacherDesignation;
}

export class Teacher {
  static create = async (req: Request, res: Response) => {
    try {
      const data: {
        schoolId: string;
        teachersData: TeacherData[];
      } = req.body;
      const { schoolId, teachersData } = data;
      const isSchool = await db.query.schoolsTable.findFirst({
        where: eq(schoolsTable.id, schoolId),
      });
      if (!isSchool) {
        throw new Error("School not exists");
      }

      const responseData = await db.transaction(async (tx) => {
        console.log({teachersData})
        const userData = teachersData.map((d) => {
          return {
            schoolId: schoolId,
            email: d.email,
            password: d.password,
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
        console.log({usersResponse})
        const teachersDataTofeed = usersResponse.map((d, i) => {
          return {
            userId: d.userId,
            schoolId,
            startDate: Utils.toUTCFromIST(teachersData[i]?.startDate),
            endDate: Utils.toUTCFromIST(teachersData[i]?.endDate),
            designation: teachersData[i]?.designation,
          };
        });
        console.log({teachersDataTofeed})
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
}
