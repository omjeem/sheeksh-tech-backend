import z from "zod";

export class Notification {
  static createCategory = z.object({
    body: z.object({
      categories: z.array(z.string().min(2).max(60)),
    }),
  });
}
