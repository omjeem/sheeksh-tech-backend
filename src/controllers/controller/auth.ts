import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";
import { Utils } from "../../utils/dateTime";

export class Auth {
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password, isSuperAdmin = false } = req.body;
      const { schoolId, role, userId } =
        await Services.UserService.validateUserIdAndPassword(
          email,
          password,
          isSuperAdmin
        );
      const generateJwt = await Utils.generateJwt(
        email,
        schoolId,
        role,
        userId
      );
      return successResponse(res, 200, "Logged in Successfully!", {
        generateJwt,
      });
    } catch (error: any) {
      return errorResponse(res, 401, error.message || error);
    }
  };
}
