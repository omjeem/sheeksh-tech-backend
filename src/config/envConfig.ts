import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

const envVarsSchema = z.object({
  PORT: z
    .string()
    .default("8078")
    .transform((str) => parseInt(str, 10)),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().nonempty(),
  BACKEND_URL: z.string().nonempty(),
  JWT_EXPIRES_IN: z
    .string()
    .nonempty()
    .transform((str) => parseInt(str, 10)),
  RENSEND_API_KEY: z.string().nonempty(),
});

const envVars = envVarsSchema.parse(process.env);

export const envConfigs = {
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  database_url: envVars.DATABASE_URL,
  backend_url: envVars.BACKEND_URL,
  notification: {
    resendApiKey: envVars.RENSEND_API_KEY,
  },
};
