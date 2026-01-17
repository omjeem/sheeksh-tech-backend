import { NextFunction, Request, Response } from "express";
import { errorResponse } from "@/config/response";
import { UserRolesType } from "@/types/types";
import Constants from "@/config/constants";

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

export const systemAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.user.role;
    if (userRole !== Constants.SYSTEM_ADMIN.ROLE) {
      throw new Error(
        `This is System Admin protected route ${userRole} role are not allowed for this route`
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

export const systemAdminSuperRootAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userAccess = req.user.access;
    if (userAccess !== Constants.SYSTEM_ADMIN.ACCESS.SUPER_ROOT) {
      throw new Error(
        `This is Super Root access protected route ${userAccess} access are not allowed for this route`
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

export const systemAdminRootAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userAccess = req.user.access;
    if (
      userAccess !== Constants.SYSTEM_ADMIN.ACCESS.ROOT &&
      userAccess !== Constants.SYSTEM_ADMIN.ACCESS.SUPER_ROOT
    ) {
      throw new Error(
        `This is Root access protected route ${userAccess} access are not allowed for this route`
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

export const systemAdminMaintainerAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userAccess = req.user.access;
    if (
      userAccess !== Constants.SYSTEM_ADMIN.ACCESS.ROOT &&
      userAccess !== Constants.SYSTEM_ADMIN.ACCESS.SUPER_ROOT &&
      userAccess !== Constants.SYSTEM_ADMIN.ACCESS.MAINTAINER
    ) {
      throw new Error(
        `You have View only permission! you can't write/delete on this route`
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
