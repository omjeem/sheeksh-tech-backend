import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../config/response";
import { Utils } from "../utils";
import { UserRoles, UserRolesType } from "../types/types";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole: UserRolesType = req.user.role;
    if (userRole === UserRoles.SUPER_ADMIN || userRole === UserRoles.ADMIN) {
      next();
    }
    throw new Error(
      `This is Admin protected route ${userRole} role are not allowed for this route`
    );
  } catch (error: any) {
    return errorResponse(res, 401, error.message || error);
  }
};

export const superAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole: UserRolesType = req.user.role;
    if (userRole === UserRoles.SUPER_ADMIN) {
      next();
    }
    throw new Error(
      `This is Super Admin protected route ${userRole} role are not allowed for this route`
    );
  } catch (error: any) {
    return errorResponse(res, 401, error.message || error);
  }
};
