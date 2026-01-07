import z from "zod";
import Constants from "../../config/constants";

export class User {
  static search = z.object({
    body: z.object({
      type: z.enum(Constants.USER_ROLES),
      searchQuery: z.string().optional(),
      classId: z.uuid().optional(),
      sessionId: z.uuid().optional(),
      sectionId: z.uuid().optional(),
      studentId: z.uuid().optional(),
      teacherId: z.uuid().optional(),
      subjectId: z.uuid().optional(),
    }),
  });
}
