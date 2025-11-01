export interface UserTokenPayload {
  user: {
    userId: string;
    email: string;
    schoolId: string;
    role: UserRolesType;
  };
}

enum UserRolesEnum {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
  ACCOUNTANT = "ACCOUNTANT",
}

export const UserRoles = {
  ...UserRolesEnum,
  SUPER_ADMIN: "SUPER_ADMIN",
};
export type UserRolesType = (typeof UserRoles)[keyof typeof UserRoles];

export enum TeacherDesignation {
  TGT = "TGT",
  PGT = "PGT",
}
