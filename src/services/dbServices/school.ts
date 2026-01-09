import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { schoolsTable } from "@/db/schema";
import { CreateSchool_Type } from "@/validators/validator/school";
import { Utils } from "@/utils";
import Services from "..";
import Constants from "@/config/constants";

export class School {
  
  static create = async (body: CreateSchool_Type) => {
    const { name, email, url, address, meta, phone, admin, city, state } = body;

    const superAdminEmail = admin.email;
    const superAdminPhone = admin.phone;
    const superAdminFirstName = admin.firstName;
    const superAdminLastName = admin.lastName;
    const superAdminDateOfBirth = Utils.toUTCFromIST(admin.dateOfBirth);
    const superAdminPassword = admin.password;

    const existingSchool = await db.query.schoolsTable.findFirst({
      where: or(
        eq(schoolsTable.email, email),
        eq(schoolsTable.phone, phone),
        eq(schoolsTable.url, url)
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
    }
    if (itemsPresentAlreayd.length > 0) {
      const errorMessage = `Following details are already exists in the databse: ${itemsPresentAlreayd
        .map((item) => `${item.field} = ${item.value}`)
        .join(", ")}`;

      throw new Error(errorMessage);
    }

    return await db.transaction(async (tx) => {
      const schoolData = await tx
        .insert(schoolsTable)
        .values({
          name,
          email,
          url,
          city,
          state,
          address,
          phone,
          meta,
          isApproved: true,
        })
        .returning({ id: schoolsTable.id });

      const schoolId = schoolData[0]!.id;

      return await Services.User.addNewUsers(
        [
          {
            schoolId,
            role: Constants.USER_ROLES.SUPER_ADMIN,
            email: superAdminEmail,
            password: Utils.hashPassword(superAdminPassword, superAdminEmail),
            phone: superAdminPhone,
            dateOfBirth: superAdminDateOfBirth,
            isSuspended: false,
            firstName: superAdminFirstName,
            lastName: superAdminLastName || null,
          },
        ],
        tx
      );
    });
  };

  static isSchoolExistsAndActive = async (schoolId: string) => {
    const isExists = await db.query.schoolsTable.findFirst({
      where: eq(schoolsTable.id, schoolId),
    });
    if (!isExists) {
      throw new Error("School not exists");
    }
    return isExists;
  };
}
