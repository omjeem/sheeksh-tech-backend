import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../config/response";
import { Utils } from "../utils";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req["headers"]["authorization"];

    if (!token) {
      throw new Error("Token not found");
    }
    const tokenBody = token.split(" ");
    if (tokenBody.length !== 2) {
      throw new Error("Invalid token");
    }
    if (tokenBody[0] !== "Bearer") {
      throw new Error("Invalid token");
    }
    const tokenString = tokenBody[1] || "";
    const jwtData = Utils.verifyTokenAndGetPayload(tokenString);
    if (!jwtData.valid) {
      throw new Error(jwtData.error);
    }
    req.user = {
      ...jwtData.data.user,
    };
    next();
  } catch (error: any) {
    return errorResponse(res, 401, error.message || error);
  }
};
