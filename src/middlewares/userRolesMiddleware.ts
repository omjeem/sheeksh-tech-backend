import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../config/response";
import { UserRolesType } from "../types/types";
import Constants from "../config/constants";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole: UserRolesType = req.user.role;
    if (
      userRole !== Constants.USER_ROLES.SUPER_ADMIN &&
      userRole !== Constants.USER_ROLES.ADMIN
    ) {
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
    if (userRole !== Constants.USER_ROLES.SUPER_ADMIN) {
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
