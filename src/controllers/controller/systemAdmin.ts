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
      return successResponse(res, "Profile Update Successfully!", null);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static createNotificationPlan = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user;
      const body = req.body;
      console.log({ body });
      const plan = await Services.SystemAdmin.createNotificationPlan(
        body,
        userId
      );
      return successResponse(res, "Plan Created Successfully!", plan);
    } catch (error: any) {
      console.log("Error While create Notification Plan", error);
      return errorResponse(res, error.message || error);
    }
  };

  static getAllNotificationPlan = async (req: Request, res: Response) => {
    try {
      const plan = await Services.SystemAdmin.getAllNotificationPlans({});
      return successResponse(res, "All Plans fetched Successfully!", plan);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getAllSchoolList = async (req: Request, res: Response) => {
    try {
      const plan = await Services.School.getAllSchoolsDetails();
      return successResponse(
        res,
        "All School List fetched Successfully!",
        plan
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static purchasePlanForSchool = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user;
      const body = req.body;
      const purchasedPlan = await Services.SystemAdmin.purchasePlanForSchool(
        userId,
        body
      );
      return successResponse(
        res,
        "Plan purchased successfully!",
        purchasedPlan
      );
    } catch (error: any) {
      console.log("Error While Purchasing plan", error);
      return errorResponse(res, error.message || error);
    }
  };
}
