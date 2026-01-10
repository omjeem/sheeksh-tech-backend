import { Request, Response } from "express";
import { errorResponse, successResponse } from "@/config/response";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import Services from "@/services";
import Constants from "@/config/constants";
import { BulkUserSearch } from "@/validators/types";

export class User {
  static create = async (req: Request, res: Response) => {
    try {
      const { role, password, email, firstName, lastName } = req.body;
      const schoolId = req.user.schoolId;
      const userData = await db.insert(usersTable).values({
        schoolId,
        role,
        password,
        email,
        firstName,
        lastName,
      });
      return successResponse(
        res,
        "User Created Successfully",
        userData,
        Constants.STATUS_CODE.CREATED
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getUserDetails = async (req: Request, res: Response) => {
    try {
      const { role, userId } = req.user;
      let userData;
      if (role === Constants.SYSTEM_ADMIN.ROLE) {
        userData = await Services.SystemAdmin.getUserDetails(userId);
      } else {
        userData = await Services.User.getUserDetails(userId);
      }
      return successResponse(res, "User Data fetched Successfully!", userData);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static userSearch = async (req: Request, res: Response) => {
    try {
      const { userId, schoolId } = req.user;
      const { pageNo, pageSize }: any = req.query;

      const limit = parseInt(pageSize);
      const offSet = (parseInt(pageNo) - 1) * limit;
      //@ts-ignore
      const query: BulkUserSearch["body"] = req.body;
      const finalResponse: any[] = [];
      const searchObj: Omit<BulkUserSearch["body"], "type"> = {
        ...(query.classId && { classId: query.classId }),
        ...(query.sectionId && { sectionId: query.sectionId }),
        ...(query.sessionId && { sessionId: query.sessionId }),
        ...(query.searchQuery && { searchQuery: query.searchQuery }),
      };
      if (query.type === Constants.USER_ROLES.STUDENT) {
        if (query.studentId) {
          searchObj.studentId = query.studentId;
        }
        const responseData = await Services.User.studentSearch({
          schoolId,
          searchObj,
          limit,
          offSet,
        });
        finalResponse.push(...responseData);
      } else if (query.type === Constants.USER_ROLES.TEACHER) {
        if (query.subjectId) {
          searchObj.subjectId = query.subjectId;
        }
        if (query.teacherId) {
          searchObj.teacherId = query.teacherId;
        }
        const responseData = await Services.User.teacherSearch({
          schoolId,
          searchObj,
          limit,
          offSet,
        });
        finalResponse.push(...responseData);
      }
      return successResponse(res, "User Searched Successfully", finalResponse);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };
}
