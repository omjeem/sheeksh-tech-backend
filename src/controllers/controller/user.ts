import { Request, Response } from "express";
import {
  errorResponse,
  sqlErrors,
  successResponse,
} from "@/config/response";
import Services from "@/services";
import Constants from "@/config/constants";
import { BulkUserSearch, CreateGuardian_Type } from "@/validators/types";
import { Utils } from "@/utils";

export class User {
  static createGuardian = async (req: Request, res: Response) => {
    try {
      const body: CreateGuardian_Type["body"] = req.body;
      const { schoolId } = req.user;

      const dataToFeed = body.map((u) => {
        return {
          ...u,
          password: Utils.hashPassword(u.password, u.email),
          role: Constants.USER_ROLES.GUARDIAN,
          schoolId,
          dateOfBirth: Utils.toUTCFromIST(u.dateOfBirth) ?? null,
          isSuspended: false,
        };
      });
      const userData = await Services.User.addNewUsers(dataToFeed);
      return successResponse(
        res,
        "Guardian Created Successfully",
        userData,
        Constants.STATUS_CODE.CREATED
      );
    } catch (error: any) {
      return errorResponse(res, sqlErrors(error));
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
        ...(query.role && { role: query.role }),
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
      } else if (query.type === "USER") {
        const responseData = await Services.User.userSearch({
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

  static userGuardianRelationMap = async (req: Request, res: Response) => {
    try {
      const { userId, schoolId } = req.user;
      const body = req.body;
      const data = await Services.User.userGuardianRelationMap({
        schoolId,
        data: body,
      });
      return successResponse(
        res,
        "User Successfully mapped with the guardians",
        data
      );
    } catch (error: any) {
      return errorResponse(
        res,
        sqlErrors(
          error,
          "Some user relation with guardian already exists"
        )
      );
    }
  };

  static getAllUserGuardians = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { userId }: any = req.params;
      const userData = await Services.User.getGuardians({
        schoolId,
        userId: userId,
      });
      return successResponse(
        res,
        "All Guardians Fetched Successfully",
        userData
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };
}
