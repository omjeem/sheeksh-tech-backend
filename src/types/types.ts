import { db } from "../config/db";

export interface UserTokenPayload {
  user: {
    userId: string;
    email: string;
    schoolId: string;
    role: UserRolesType;
  };
}

export const UserRoles = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
  ACCOUNTANT: "ACCOUNTANT",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export type UserRolesType = (typeof UserRoles)[keyof typeof UserRoles];

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
