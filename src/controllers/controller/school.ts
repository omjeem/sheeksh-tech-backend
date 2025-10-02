import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import { errorResponse, successResponse } from "../../config/response";
import { db } from "../../config/db";
import { school_master } from "../../config/schema";

export class School {
  static createSchool = async (req: Request, res: Response) => {
    try {
      const {
        name,
        address,
        phone,
        email,
        website,
        superAdminName,
        superAdminEmail,
        superAdminPassword,
      } = req.body;

      const existing = await db.query.school_master.findFirst({
        where: or(
          eq(school_master.email, email),
          eq(school_master.website, website),
          eq(school_master.superAdminEmail, superAdminEmail)
        ),
      });

      if (existing) {
        return errorResponse(res, 400, "School or super admin already registered.");
      }

    //   const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

      await db.insert(school_master).values({
        name,
        address,
        phone,
        email,
        website,
        superAdminName,
        superAdminEmail,
        superAdminPassword,
        isVerified: false,
      });

      return successResponse(
        res,
        201,
        "School registration successful. Awaiting verification.",
        null
      );
    } catch (error) {
      console.error("School Onboarding Error:", error);
      return errorResponse(res, 500, "Internal Server Error");
    }
  };
}
