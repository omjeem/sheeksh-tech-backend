import z, { email } from "zod";
import { zodDateValidator } from "./common";
import { TeacherDesignation } from "../../types/types";

const createZod = z.array(
  z.object({
    email: z.email(),
    password: z.string().optional(),
    dateOfBirth: zodDateValidator,
    firstName: z.string(),
    lastName: z.string(),
    startDate: zodDateValidator,
    endDate: zodDateValidator.optional(),
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
      fromDate: zodDateValidator,
    }),
  });

  static getTeacherClassSectionMap = z.object({
    query: z.object({
      teacherId: z.uuid().optional(),
      classId: z.uuid().optional(),
      sessionId: z.uuid().optional(),
      sectionId: z.uuid().optional(),
      subjectId: z.uuid().optional(),
      fromDate: zodDateValidator.optional(),
    }),
  });
}

export type CreateTeachers_Type = z.infer<typeof createZod>;
