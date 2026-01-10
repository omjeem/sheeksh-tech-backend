import { errorResponse, successResponse } from "@/config/response";
import Services from "@/services";
import { Utils } from "@/utils";
import { Request, Response } from "express";

export class SystemAdmin {
  static updatePassword = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user;
      const { password } = req.body;
      const userDetails = await Services.SystemAdmin.getUserDetails(userId);
      const userEmail = userDetails?.email!;
      const hashedPassword = Utils.hashPassword(password, userEmail);
      await Services.SystemAdmin.updateProfile(userId, {
        password: hashedPassword,
      });
      return successResponse(
        res,
        "Profile Update Successfully!",
        null
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };
}
