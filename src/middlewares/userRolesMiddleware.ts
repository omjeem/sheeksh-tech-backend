import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../config/response";
import { UserRoles, UserRolesType } from "../types/types";
import Constants from "../config/constants";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole: UserRolesType = req.user.role;
    if (userRole !== UserRoles.SUPER_ADMIN && userRole !== UserRoles.ADMIN) {
      console.log("Entering");
      throw new Error(
        `This is Admin protected route ${userRole} role are not allowed for this route`
      );
    }
    next();
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || error,
      Constants.STATUS_CODE.FORBIDDEN
    );
  }
};

export const superAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole: UserRolesType = req.user.role;
    if (userRole !== UserRoles.SUPER_ADMIN) {
      throw new Error(
        `This is Super Admin protected route ${userRole} role are not allowed for this route`
      );
    }
    next();
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || error,
      Constants.STATUS_CODE.FORBIDDEN
    );
  }
};
