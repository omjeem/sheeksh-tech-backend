import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  serial,
  unique,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";

// Enum for user roles



export const schoolsTable = pgTable("schools", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  url: varchar({ length: 255 }).unique().notNull(),
  address: text().notNull(),
  phone: varchar().notNull(),
  superAdminName: varchar().notNull(),
  superAdminEmail: varchar().notNull(),
  superAdminPhone: varchar().notNull(),
  superAdminPassword: varchar().notNull(),
  meta: jsonb(),
  isApproved: boolean().default(false),
  isSuspended: boolean().default(false),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Users table (all roles: super admins, teachers, students, parents)
export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  dateOfBirth: timestamp(),
  isSuspended: boolean().default(false),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Students table (specific student data)
export const studentsTable = pgTable(
  "students",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .references(() => usersTable.id)
      .notNull()
      .unique(),
    schoolId: uuid()
      .references(() => schoolsTable.id, { onDelete: "cascade" })
      .notNull(),
    srNo: varchar({ length: 50 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    uniqueSrNoPerSchool: unique("unique_sr_no_per_school").on(
      table.schoolId,
      table.srNo
    ),
  })
);

// Teachers table (specific teacher data)
export const teachersTable = pgTable("teachers", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => usersTable.id)
    .notNull()
    .unique(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  startDate: timestamp(),
  endDate: timestamp(),
  designation: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const subjectsTable = pgTable("subjects", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id)
    .notNull(),
  subject: varchar().notNull(),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const teacherClassSubjectSectionTable = pgTable(
  "teacherClassSubjectSection",
  {
    id: uuid().primaryKey().defaultRandom(),
    teacherId: uuid()
      .references(() => teachersTable.id)
      .notNull(),
    classId: uuid()
      .references(() => classesTable.id)
      .notNull(),
    sectionId: uuid()
      .references(() => sectionsTable.id)
      .notNull(),
    subjectId: uuid()
      .references(() => subjectsTable.id)
      .notNull(),
    fromDate: timestamp().notNull(),
    endDate: timestamp(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  }
);

// Teacher-School history (handles teacher school switches)
export const teacherSchoolHistoryTable = pgTable("teacher_school_history", {
  id: serial().primaryKey(),
  teacherId: uuid()
    .references(() => teachersTable.id)
    .notNull(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  startDate: timestamp().defaultNow().notNull(),
  endDate: timestamp(),
});

// Academic sessions (e.g., 2025-2026)
export const sessionsTable = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar({ length: 100 }).notNull(),
  startDate: timestamp().notNull(),
  endDate: timestamp().notNull(),
  isActive: boolean().default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Classes (e.g., Grade 10)
export const classesTable = pgTable("classes", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar({ length: 100 }).notNull(),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
});

// Sections (e.g., 10A, 10B)
export const sectionsTable = pgTable("sections", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  classId: uuid()
    .references(() => classesTable.id)
    .notNull(),
  name: varchar({ length: 50 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Student-Class assignments (links students to classes/sections per session)
export const studentClassesTable = pgTable(
  "student_classes",
  {
    id: serial().primaryKey(),
    studentId: uuid()
      .references(() => studentsTable.id)
      .notNull(),
    classId: uuid()
      .references(() => classesTable.id, { onDelete: "cascade" })
      .notNull(),
    sectionId: uuid()
      .references(() => sectionsTable.id)
      .notNull(),
    sessionId: uuid()
      .references(() => sessionsTable.id)
      .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    uniqueStudentPerSession: unique("unique_student_per_session").on(
      table.studentId,
      table.sessionId
    ),
  })
);

// Fees structure (per school)
export const feeStructuresTable = pgTable("fee_structures", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar({ length: 100 }).notNull(),
  amount: integer().notNull(),
  sessionId: uuid()
    .references(() => sessionsTable.id)
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Student fee assignments
export const studentFeesTable = pgTable("student_fees", {
  id: serial().primaryKey(),
  studentId: uuid()
    .references(() => studentsTable.id, { onDelete: "cascade" })
    .notNull(),
  feeStructureId: uuid()
    .references(() => feeStructuresTable.id)
    .notNull(),
  amountPaid: integer().default(0).notNull(),
  dueDate: timestamp().notNull(),
  paidAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Relations
export const schoolsRelations = relations(schoolsTable, ({ many }) => ({
  users: many(usersTable),
  students: many(studentsTable),
  teachers: many(teachersTable),
  sessions: many(sessionsTable),
  classes: many(classesTable),
  feeStructures: many(feeStructuresTable),
  subjects: many(subjectsTable),
}));

export const subjectRelations = relations(subjectsTable, ({ one, many }) => ({
  school: one(schoolsTable, {
    fields: [subjectsTable.schoolId],
    references: [schoolsTable.id],
  }),
  classSubjectSection: many(teacherClassSubjectSectionTable),
}));

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  school: one(schoolsTable, {
    fields: [usersTable.schoolId],
    references: [schoolsTable.id],
  }),
  student: one(studentsTable, {
    fields: [usersTable.id],
    references: [studentsTable.userId],
  }),
  teacher: one(teachersTable, {
    fields: [usersTable.id],
    references: [teachersTable.userId],
  }),
}));

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [studentsTable.userId],
    references: [usersTable.id],
  }),
  school: one(schoolsTable, {
    fields: [studentsTable.schoolId],
    references: [schoolsTable.id],
  }),
  studentClasses: many(studentClassesTable),
  studentFees: many(studentFeesTable),
}));

export const teachersRelations = relations(teachersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [teachersTable.userId],
    references: [usersTable.id],
  }),
  school: one(schoolsTable, {
    fields: [teachersTable.schoolId],
    references: [schoolsTable.id],
  }),
  history: many(teacherSchoolHistoryTable),
  classSubjectSection: many(teacherClassSubjectSectionTable),
}));

export const teacherClassSubjectRelations = relations(
  teacherClassSubjectSectionTable,
  ({ one }) => ({
    teacher: one(teachersTable, {
      fields: [teacherClassSubjectSectionTable.teacherId],
      references: [teachersTable.id],
    }),
    class: one(classesTable, {
      fields: [teacherClassSubjectSectionTable.classId],
      references: [classesTable.id],
    }),
    section: one(sectionsTable, {
      fields: [teacherClassSubjectSectionTable.sectionId],
      references: [sectionsTable.id],
    }),
    subject: one(subjectsTable, {
      fields: [teacherClassSubjectSectionTable.subjectId],
      references: [subjectsTable.id],
    }),
  })
);

export const teacherSchoolHistoryRelations = relations(
  teacherSchoolHistoryTable,
  ({ one }) => ({
    teacher: one(teachersTable, {
      fields: [teacherSchoolHistoryTable.teacherId],
      references: [teachersTable.id],
    }),
    school: one(schoolsTable, {
      fields: [teacherSchoolHistoryTable.schoolId],
      references: [schoolsTable.id],
    }),
  })
);

export const sessionsRelations = relations(sessionsTable, ({ one, many }) => ({
  school: one(schoolsTable, {
    fields: [sessionsTable.schoolId],
    references: [schoolsTable.id],
  }),
  studentClasses: many(studentClassesTable),
  feeStructures: many(feeStructuresTable),
}));

export const classesRelations = relations(classesTable, ({ one, many }) => ({
  school: one(schoolsTable, {
    fields: [classesTable.schoolId],
    references: [schoolsTable.id],
  }),
  sections: many(sectionsTable),
  classSubjectSection: many(teacherClassSubjectSectionTable),
}));

export const sectionsRelations = relations(sectionsTable, ({ one, many }) => ({
  class: one(classesTable, {
    fields: [sectionsTable.classId],
    references: [classesTable.id],
  }),
  school: one(schoolsTable, {
    fields: [sectionsTable.schoolId],
    references: [schoolsTable.id],
  }),
  studentClasses: many(studentClassesTable),
  classSubjectSection: many(teacherClassSubjectSectionTable),
}));

export const studentClassesRelations = relations(
  studentClassesTable,
  ({ one }) => ({
    student: one(studentsTable, {
      fields: [studentClassesTable.studentId],
      references: [studentsTable.id],
    }),
    class: one(classesTable, {
      fields: [studentClassesTable.classId],
      references: [classesTable.id],
    }),
    section: one(sectionsTable, {
      fields: [studentClassesTable.sectionId],
      references: [sectionsTable.id],
    }),
    session: one(sessionsTable, {
      fields: [studentClassesTable.sessionId],
      references: [sessionsTable.id],
    }),
  })
);

export const feeStructuresRelations = relations(
  feeStructuresTable,
  ({ one, many }) => ({
    school: one(schoolsTable, {
      fields: [feeStructuresTable.schoolId],
      references: [schoolsTable.id],
    }),
    session: one(sessionsTable, {
      fields: [feeStructuresTable.sessionId],
      references: [sessionsTable.id],
    }),
    studentFees: many(studentFeesTable),
  })
);

export const studentFeesRelations = relations(studentFeesTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [studentFeesTable.studentId],
    references: [studentsTable.id],
  }),
  feeStructure: one(feeStructuresTable, {
    fields: [studentFeesTable.feeStructureId],
    references: [feeStructuresTable.id],
  }),
}));
