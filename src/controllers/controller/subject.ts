import { Request, Response } from "express";
import { errorResponse } from "../../config/response";

export class Subject {
  static create = async (req: Request, res: Response) => {
    try {
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };
}
