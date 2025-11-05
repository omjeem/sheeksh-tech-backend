import z from "zod";
import Validators from "..";
import { dateValidator } from "./common";

export class Session {
  static create  = z.object({
    name: z.string(),
    startDate: dateValidator,
    endDate: dateValidator,
    isActive: z.boolean().optional(),
  });
}
