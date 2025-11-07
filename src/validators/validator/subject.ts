import z from "zod";

export class Subject {
  static create = z.object({
    body: z.object({
      name: z.string(),
    }),
  });
}
