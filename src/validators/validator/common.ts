import z from "zod";

export const zodDateValidator = z
  .string()
  .regex(/^\d{1,2}-\d{1,2}-\d{4}$/, "Date must be in DD-MM-YYYY format")
  .refine((value) => {

    const [day, month, year]: any = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return (
      !isNaN(date.getTime()) 
    );
  }, "Invalid date");
