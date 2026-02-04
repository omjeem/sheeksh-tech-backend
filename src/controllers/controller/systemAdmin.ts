import Constants from "@/config/constants";
import {
  errorResponse,
  sqlErrors,
  successResponse,
} from "@/config/response";
import Services from "@/services";
import { Utils } from "@/utils";
import {
  AddCreditsIntoSystemInventory_Type,
  NotificationChannelLimits_Type,
} from "@/validators/types";
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
      // console.log({ body });
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
      // console.log("Hit ---- ", req.query);
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

  static updateSystemInventoryLimits = async (req: Request, res: Response) => {
    try {
      const { metadata, id } = req.body;
      const update = await Services.SystemAdmin.updateSystemInventoryLimits(
        metadata,
        id
      );
      return successResponse(res, "Limits Updated Successfully", update);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getSystemInventory = async (req: Request, res: Response) => {
    try {
      const inventory = await Services.SystemAdmin.getSystemInventory({});
      return successResponse(
        res,
        "System Invetory Fetched Successfully!",
        inventory
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static notifChannelUsageLimit = async (req: Request, res: Response) => {
    try {
      const body: NotificationChannelLimits_Type["body"] = req.body;
      const limit = await Services.SystemAdmin.notifChannelUsageLimit(body);
      return successResponse(res, "Limit Set Successfully", limit);
    } catch (error: any) {
      console.log("Error in Creating the limit", error);
      return errorResponse(res, error.message || error);
    }
  };

  static getNotifChannelUsageLimit = async (req: Request, res: Response) => {
    try {
      const query = req.query || {};
      const limit = await Services.SystemAdmin.getNotifChannelUsageLimit(query);
      return successResponse(res, "Limit Set Successfully", limit);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static notifChannelLimitUpdate = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const updated = await Services.SystemAdmin.notifChannelLimitUpdate(body);
      return successResponse(res, "Limits Updated Successfully", updated);
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static createNewSystemAdminUser = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const { name, email, access, password, phone } = body;
      if (access === Constants.SYSTEM_ADMIN.ACCESS.SUPER_ROOT) {
        throw new Error(
          "SUPER_ROOT user already exits there can't be two SUPER_ROOT users"
        );
      }
      const hashedPassword = Utils.hashPassword(password, email);
      const obj = {
        name,
        email,
        access,
        password: hashedPassword,
        phone,
      };
      const newUser = await Services.SystemAdmin.createSystemAdminUser(obj);
      // console.log({ body });
      return successResponse(res, "Admin created Succesfully", newUser);
    } catch (error: any) {
      return errorResponse(res, sqlErrors(error));
    }
  };
}
