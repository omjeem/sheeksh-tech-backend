import { errorResponse, successResponse } from "@/config/response";
import Services from "@/services";
import { Utils } from "@/utils";
import { AddCreditsIntoSystemInventory_Type } from "@/validators/types";
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

  static getSystemNotificationLedger = async (req: Request, res: Response) => {
    try {
      const { pageNo = 1, pageSize = 15, id }: any = req.query;
      console.log("Hit ---- ", req.query);
      const ledgerInfo = await Services.Notification.getLedger({
        id,
        pageNo,
        pageSize,
      });
      return successResponse(
        res,
        "System Notification Ledger fetched",
        ledgerInfo
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static addCreditsIntoSystemInventory = async (
    req: Request,
    res: Response
  ) => {
    try {
      const body: AddCreditsIntoSystemInventory_Type["body"] = req.body;
      const inventory = await Services.SystemAdmin.addCreditsToSystemInventory(
        body
      );
      return successResponse(
        res,
        "Credits added into System Inventory",
        inventory
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getSystemInventory = async (req: Request, res: Response) => {
    try {
      const inventory = await Services.SystemAdmin.getSystemInventory();
      return successResponse(res, "System Invetory Fetched Successfully!", inventory)
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };
}
