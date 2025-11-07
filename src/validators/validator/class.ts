import z from "zod";

export class Class {
  static create = z.object({
    body: z.object({
      name: z.string(),
    }),
  });
}
