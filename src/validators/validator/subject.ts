import z from "zod";

export class Subject {
  static create = z.object({
    name: z.string(),
  });
}
