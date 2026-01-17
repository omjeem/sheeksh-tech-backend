import Constants, { SYSTEM_ADMIN_ACCESS_TYPES } from "../config/constants";
import { db } from "@/db";

export interface UserTokenPayload {
  user: {
    userId: string;
    email: string;
    schoolId: string;
    role: UserRolesType;
    // Used For the System Admin Only
    access: SYSTEM_ADMIN_ACCESS_TYPES;
  };
}

export type UserRolesType =
  (typeof Constants.USER_ROLES)[keyof typeof Constants.USER_ROLES];

export enum TeacherDesignation {
  TGT = "TGT",
  PGT = "PGT",
}

export interface NotificationTemplatePayload {
  subject: string;
  bodyHtml: string;
  bodyText: string;
  variables: string[];
}

export type PostgressTransaction_Type = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];
