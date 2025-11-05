import z from "zod";

export const dateValidator = z
  .string()
  .regex(/^\d{1,2}-\d{1,2}-\d{4}$/, "Date must be in DD-MM-YYYY format")
  .refine((value) => {
    console.log({ value });
    const [day, month, year]: any = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    console.log(
      date.getTime(),
      date.getUTCFullYear(),
      year,
      date.getUTCMonth(),
      month - 1,
      date.getUTCDate(),
      day
    );

    return (
      !isNaN(date.getTime()) 
    );
  }, "Invalid date");
