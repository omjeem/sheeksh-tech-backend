import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import { errorResponse, successResponse } from "../../config/response";
import { db } from "../../config/db";
import { schoolsTable, usersTable } from "../../config/schema";

export class School {
  static createSchool = async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        url,
        address,
        meta,
        phone,
        superAdminName,
        superAdminEmail,
        superAdminPhone,
        superAdminPassword,
      } = req.body;

      const existingSchool = await db.query.schoolsTable.findFirst({
        where: or(
          eq(schoolsTable.email, email),
          eq(schoolsTable.phone, phone),
          eq(schoolsTable.url, url),
          eq(schoolsTable.superAdminEmail, superAdminEmail),
          eq(schoolsTable.superAdminPhone, superAdminPhone)
        ),
      });
      const itemsPresentAlreayd = [];
      if (existingSchool) {
        if (existingSchool.email === email) {
          itemsPresentAlreayd.push({
            field: "email",
            value: email,
          });
        }
        if (existingSchool.phone === phone) {
          itemsPresentAlreayd.push({
            field: "phone",
            value: phone,
          });
        }
        if (existingSchool.url === url) {
          itemsPresentAlreayd.push({
            field: "url",
            value: url,
          });
        }
        if (existingSchool.superAdminEmail === superAdminEmail) {
          itemsPresentAlreayd.push({
            field: "superAdminEmail",
            value: superAdminEmail,
          });
        }
        if (existingSchool.superAdminPhone === superAdminPhone) {
          itemsPresentAlreayd.push({
            field: "superAdminPhone",
            value: superAdminPhone,
          });
        }
      }
      if (itemsPresentAlreayd.length > 0) {
        const errorMessage = `Following details are already exists in the databse: ${itemsPresentAlreayd
          .map((item) => `${item.field} = ${item.value}`)
          .join(", ")}`;

        throw new Error(errorMessage);
      }

      //   const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

      const school = await db
        .insert(schoolsTable)
        .values({
          name,
          email,
          url,
          address,
          phone,
          superAdminName,
          superAdminEmail,
          superAdminPhone,
          superAdminPassword,
          meta,
          isApproved: true,
          isSuspended: false,
        })
        .returning();

      return successResponse(
        res,
        201,
        "School registration successful. Awaiting verification.",
        school
      );
    } catch (error: any) {
      console.error("School Onboarding Error:", error);
      return errorResponse(res, 400, error?.message || error);
    }
  };
}
