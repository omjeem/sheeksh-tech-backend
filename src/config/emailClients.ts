import { Resend } from "resend";
import { envConfigs } from "./envConfig";

export const resend = new Resend(envConfigs.notification.resendApiKey);
