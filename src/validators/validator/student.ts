import z from "zod";
import { zodDateValidator } from "./common";

const studentFeedData = z.object({
  classId: z.uuid(),
  sessionId: z.uuid(),
  sectionId: z.uuid(),
  selfAssignSr: z.boolean().optional(),
  studentData: z.array(
    z.object({
      srNo: z.number(),
      password: z.string().min(3).optional(),
      email: z.email(),
      firstName: z.string(),
      lastName: z.string(),
      dateOfBirth: zodDateValidator,
      phone: z.string(),
      // parent: z
      //   .object({
      //     email: z.email(),
      //     password: z.string().optional(),
      //     firstName: z.string(),
      //     lastName: z.string().optional(),
      //     phone: z.string(),
      //     dateOfBirth: zodDateValidator.optional(),
      //   })
      //   .optional(),
    })
  ),
});

const studentClassSection = z.object({
  sessionId: z.uuid().optional(),
  sectionId: z.uuid().optional(),
  classId: z.uuid().optional(),
  studentId: z.uuid().optional(),
});

export class Student {
  static feedStudents = z.object({
    body: studentFeedData,
  });

  static getClassStudent = z.object({
    query: studentClassSection,
  });
}

export type FeedStudents_Type = z.infer<typeof studentFeedData>;
export type GetStudentClassSection_Type = z.infer<typeof studentClassSection>;
