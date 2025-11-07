import { z } from "zod";
import { dateValidator } from "./common";

export class School {
  static createSchool = z.object({
    body: z.object({
      name: z.string().min(3),
      email: z.email(),
      url: z.string(),
      address: z.string(),
      meta: z.string().nullable(),
      phone: z.string(),
      superAdminName: z.string(),
      superAdminEmail: z.email(),
      superAdminPhone: z.string(),
      superAdminPassword: z.string(),
    }),
  });

  
}
