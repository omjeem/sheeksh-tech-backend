import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";
import { Utils } from "../../utils";

export class Auth {
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { schoolId, role, userId } =
        await Services.User.validateUserIdAndPassword(email, password);
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
