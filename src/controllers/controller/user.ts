import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import { db } from "../../config/db";
import { UserRoles, usersTable } from "../../config/schema";

export class User {
  static create = async (req: Request, res: Response) => {
    try {
      const { schoolId, role, password, email, firstName, lastName } =
        req.body;
      const userData = await db.insert(usersTable).values({
        schoolId,
        role,
        password,
        email,
        firstName,
        lastName,
      });
      return successResponse(res, 201, "User Created Successfully", userData);
    } catch (error: any) {
      return errorResponse(res, 400, error.message || error);
    }
  };
}
