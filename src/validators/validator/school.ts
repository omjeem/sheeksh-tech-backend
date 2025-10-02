import z from "zod"

export class School {
  createSchool = z.object({
    name: z.string().min(3),
    address: z.string().min(10),
    phone: z.string().min(10).max(15),
    email: z.string().email(),
    website: z.string().url(),

    superAdminName: z.string().min(3),
    superAdminEmail: z.string().email(),
    superAdminPassword: z.string().min(8)
  });
}
