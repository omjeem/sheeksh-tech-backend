import { InferSelectModel } from "drizzle-orm";
import {
  usersTable,
  schoolsTable,
  studentsTable,
  teachersTable,
  subjectsTable,
  teacherClassSubjectSectionTable,
  teacherSchoolHistoryTable,
  sessionsTable,
  classesTable,
  sectionsTable,
  studentClassSectionTable,
  feeStructuresTable,
  studentFeesTable,
} from "./schema";

export type UsersTable_Type = InferSelectModel<typeof usersTable>;
export type SchoolTable_Type = InferSelectModel<typeof schoolsTable>;
export type StudentsTable_Type = InferSelectModel<typeof studentsTable>;
export type TeachersTable_Type = InferSelectModel<typeof teachersTable>;
export type SubjectsTable_Type = InferSelectModel<typeof subjectsTable>;
export type TeacherClassSubjectSectionTable_Type = InferSelectModel<
  typeof teacherClassSubjectSectionTable
>;
export type TeacherSchoolHistoryTable_Type = InferSelectModel<
  typeof teacherSchoolHistoryTable
>;
export type SessionsTable_Type = InferSelectModel<typeof sessionsTable>;
export type SectionsTable_Type = InferSelectModel<typeof sectionsTable>;
export type ClassesTable_Type = InferSelectModel<typeof classesTable>;
export type studentClassSectionTable_Type = InferSelectModel<
  typeof studentClassSectionTable
>;
export type FeeStructuresTable_Type = InferSelectModel<
  typeof feeStructuresTable
>;
export type StudentFeesTable_Type = InferSelectModel<typeof studentFeesTable>;
