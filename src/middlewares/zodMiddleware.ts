import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod/v3";
import { errorResponse } from "../config/response";

export const validateRequest =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.body)
      const sanitizedValues = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      console.log({ sanitizedValues });
      if (req.body) Object.assign(req.body, sanitizedValues.data);
      if (req.params) Object.assign(req.params, sanitizedValues.params);
      if (req.query) Object.assign(req.query, sanitizedValues.query);

      return next();
    } catch (error: any) {
      // console.log(error.issues, error.name);

      const validationErrors: { [key: string]: string } = {};
      // if (error instanceof ZodError) {

      // }
      error.issues.forEach((e: any) => {
        // console.log({ e });
        validationErrors[e.path.join(".")] = e.message;
      });
      errorResponse(res, 400, validationErrors);
    }
  };
