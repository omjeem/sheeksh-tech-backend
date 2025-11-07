import z from "zod";

export class Section {
  static create = z.object({
    body: z.object({
      classId: z.uuid(),
      name: z.string(),
    }),
  });

  static getAll = z.object({
    body: z.object({
      classId: z.uuid(),
    }),
  });
}
