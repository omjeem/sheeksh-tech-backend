import { z } from "zod";

export class Auth {
  static login = z.object({
    body: z.object({
      email: z.email(),
      password: z.string(),
    }),
  });
}
