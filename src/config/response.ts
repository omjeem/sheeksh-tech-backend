import { Response } from "express";
import Constants from "./constants";

export function successResponse(
  res: Response,
  message: string,
  data: any,
  status: number = Constants.STATUS_CODE.SUCCESS
) {
  return res.status(status).json({ success: true, message, data });
}

export function errorResponse(
  res: Response,
  error: any,
  status: number = Constants.STATUS_CODE.BAD_REQUEST
) {
  return res.status(status).json({ success: false, error: error });
}

export function sqlDuplicateError(error: any, preMsg: string | null = null) {
  let message = error.message || error;
  if (error?.cause?.code === "23505") {
    message = preMsg ?? error?.cause?.detail;
  }
  return message;
}
