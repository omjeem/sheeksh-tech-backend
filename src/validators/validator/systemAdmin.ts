import z from "zod";

export class SystemAdmin {
  static profileUpdate = z.object({
    body: z.object({
      password: z.string().min(3),
    }),
  });
}
