import { Request, Response } from "express";
import { errorResponse, successResponse } from "@/config/response";
import Services from "@/services";
import { Utils } from "@/utils";
import Constants from "@/config/constants";

export class Auth {
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password, isSystemAdmin = false } = req.body;
      let generateJwt;
      if (isSystemAdmin) {
        const { userId, access } =
          await Services.SystemAdmin.validateUserIdAndPassword(email, password);
        generateJwt = await Utils.generateJwtForSystemAdmin({
          email,
          access,
          userId,
        });
      } else {
        const { schoolId, role, userId } =
          await Services.User.validateUserIdAndPassword(email, password);
        generateJwt = await Utils.generateJwtForUser(
          email,
          schoolId,
          role,
          userId
        );
      }

      return successResponse(res, "Logged in Successfully!", generateJwt);
    } catch (error: any) {
      return errorResponse(
        res,
        error.message || error,
        Constants.STATUS_CODE.UNAUTHORIZED
      );
    }
  };
}
