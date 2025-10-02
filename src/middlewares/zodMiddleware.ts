import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod/v3";
import { errorResponse } from "../config/response";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sanitizedValues = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (req.body) Object.assign(req.body, sanitizedValues.body);
      if (req.params) Object.assign(req.params, sanitizedValues.params);
      if (req.query) Object.assign(req.query, sanitizedValues.query);

      return next();
    } catch (error: any) {
      const validationErrors: { [key: string]: string } = {};
      if (error instanceof ZodError) {
        error.errors.forEach((e) => {
          validationErrors[e.path.join(".")] = e.message;
        });
      }

      errorResponse(res, 400, validationErrors);
    }
  };
