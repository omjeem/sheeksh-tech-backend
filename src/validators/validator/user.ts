import z from "zod";
import Constants from "@/config/constants";
import { zodDateValidator } from "./common";

export class User {
  static search = z.object({
    body: z.object({
      type: z.enum([
        Constants.USER_ROLES.STUDENT,
        Constants.USER_ROLES.TEACHER,
        "USER",
      ]),
      searchQuery: z.string().optional(),
      classId: z.uuid().optional(),
      sessionId: z.uuid().optional(),
      sectionId: z.uuid().optional(),
      studentId: z.uuid().optional(),
      teacherId: z.uuid().optional(),
      subjectId: z.uuid().optional(),
      role: z.enum(Constants.USER_ROLES).optional(),
    }),
    query: z.object({
      pageNo: z.coerce.number().int().positive(),
      pageSize: z.coerce.number().int().positive(),
    }),
  });

  static userGuardianRelationMap = z.object({
    body: z.object({
      childUserId: z.uuid(),
      guardians: z
        .array(
          z.object({
            guardianUserId: z.uuid(),
            relation: z.enum(Constants.GUARDIANS_RELATIONS),
          })
        )
        .nonempty(),
    }),
  });

  static createGuardian = z.object({
    body: z
      .array(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.email(),
          password: z.string(),
          phone: z.string(),
          dateOfBirth: zodDateValidator,
        })
      )
      .nonempty(),
  });

  static getAllUserGuardians = z.object({
    params: z.object({
      userId: z.uuid(),
    }),
  });
}
