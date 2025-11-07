import z, { email } from "zod";
import { dateValidator } from "./common";
import { TeacherDesignation } from "../../types/types";

const createZod = z.array(
  z.object({
    email: z.email(),
    password: z.string().optional(),
    dateOfBirth: dateValidator,
    firstName: z.string(),
    lastName: z.string(),
    startDate: dateValidator,
    endDate: dateValidator.optional(),
    designation: z.enum(TeacherDesignation),
  })
);
export class Teacher {
  static create = z.object({
    body: createZod,
  });
  
  static teacherClassSectionMap = z.object({
    body: z.object({
      teacherId: z.uuid(),
      classId: z.uuid(),
      sessionId: z.uuid(),
      sectionId: z.uuid(),
      subjectId: z.uuid(),
      fromDate: dateValidator,
    }),
  });

  static getTeacherClassSectionMap = z.object({
    body: z.object({
      allDate: z.boolean().optional(),
      teacherId: z.uuid().optional(),
      classId: z.uuid().optional(),
      sessionId: z.uuid().optional(),
      sectionId: z.uuid().optional(),
      subjectId: z.uuid().optional(),
      fromDate: dateValidator.optional(),
    }),
  });
}

export type CreateTeachers_Type = z.infer<typeof createZod>;
