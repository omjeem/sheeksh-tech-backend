import z from "zod";
import { dateValidator } from "./common";

export class Student {
  static feedStudents = z.object({
    classId: z.string(),
    sessionId: z.string(),
    sectionId: z.string(),
    studentData: z.array(
      z.object({
        srNo: z.number(),
        password: z.string().min(3).optional(),
        email: z.email(),
        firstName: z.string(),
        lastName: z.string(),
        dateOfBirth: dateValidator,
      })
    ),
  });
}

export type FeedStudents = z.infer<typeof Student.feedStudents>;



