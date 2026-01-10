import e, { NextFunction, Request, Response } from "express";
import { errorResponse } from "@/config/response";
import Constants from "@/config/constants";

export const validateRequest =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sanitizedValues = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      if (req.body) Object.assign(req.body, sanitizedValues.data);
      if (req.params) Object.assign(req.params, sanitizedValues.params);
      if (req.query) Object.assign(req.query, sanitizedValues.query);

      return next();
    } catch (error: any) {
      const validationErrors: { [key: string]: string } = {};
      // if (error instanceof ZodError) {
      // }
      error?.issues?.forEach((e: any) => {
        validationErrors[e?.path?.join(".")] = e?.message;
      });
      errorResponse(res, validationErrors, Constants.STATUS_CODE.BAD_REQUEST);
    }
  };
