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
}

export type CreateTeachers_Type = z.infer<typeof createZod>;
