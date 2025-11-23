import { z } from "zod";
import { zodDateValidator } from "./common";

const createSchool = z.object({
  name: z.string().min(3),
  email: z.email(),
  url: z.string(),
  city: z.string(),
  state: z.string(),
  address: z.string(),
  meta: z.string().nullable(),
  phone: z.string(),
  admin: z.object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string().optional(),
    dateOfBirth: zodDateValidator.optional(),
    password: z.string().min(3),
    phone: z.string(),
  }),
});

export class School {
  static createSchool = z.object({
    body: createSchool,
  });
}

export type CreateSchool_Type = z.infer<typeof createSchool>;
