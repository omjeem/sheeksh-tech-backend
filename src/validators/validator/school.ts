import {z} from "zod";
import Validators from "..";
import { dateValidator } from "./common";

export class School {
  static createSchool = z.object({
    name: z.string().min(3),
    email: z.email(),
    url: z.string(),
    address: z.string(),
    meta: z.string(),
    phone: z.string(),
    superAdminName: z.string(),
    superAdminEmail: z.email(),
    superAdminPhone: z.string(),
    superAdminPassword: z.string(),
  });

  static teacherClassSectionMap = z.object({
    teacherId: z.string(),
    classId: z.string(),
    sessionId: z.string(),
    sectionId: z.string(),
    subjectId: z.string(),
    fromDate: dateValidator,
  });
}
