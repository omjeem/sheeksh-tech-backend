import z from "zod";

export class Session {
  static create = z.object({
    body: z.object({
      name: z
        .string()
        .regex(/\d{4}-\d{4}/, {
          message: "Name must be in numeric YYYY-YYYY format",
        })
        .refine(
          (value) => {
            const [start, end]: any = value.split("-").map(Number);
            return start < end;
          },
          {
            message: "Start year should be smaller than end year",
          }
        )
        .refine(
          (value) => {
            const [start, end]: any = value.split("-").map(Number);
            return end - start === 1;
          },
          {
            message: "Difference between end and start year should be 1",
          }
        ),
      isActive: z.boolean(),
    }),
  });

  static updateSessionState = z.object({
    body: z.object({
      sessionId: z.uuid(),
      status: z.boolean(),
    }),
  });

  static getSessions = z.object({
    query: z.object({
      active: z.string().optional(),
    }),
  });
}
