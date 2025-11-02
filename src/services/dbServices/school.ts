import { eq, or } from "drizzle-orm";
import { db } from "../../config/db";
import { schoolsTable } from "../../config/schema";

export class School {
  static create = async (body: any) => {
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
    } = body;

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

    return await db
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
  };

  static isSchoolExistsAndActive = async (schoolId: string) => {
    const isExists = await db.query.schoolsTable.findFirst({
      where: eq(schoolsTable.id, schoolId),
    });
    if(!isExists){
      throw new Error("School not exists")
    }
    return isExists
  };
}
