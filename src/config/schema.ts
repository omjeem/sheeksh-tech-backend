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

export enum UserRoles {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
  ACCOUNTANT = "ACCOUNTANT",
  CLASS_TEACHER = "CLASS_TEACHER",
}
export const roleEnum = pgEnum("role", UserRoles);

// Schools table (multi-tenant entity)
export const schoolsTable = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).unique().notNull(), // e.g., school-specific subdomain
  address: text("address").notNull(),
  phone: varchar("phone").notNull(),
  superAdminName: varchar("superAdminName").notNull(),
  superAdminEmail: varchar("superAdminEmail").notNull(),
  superAdminPhone: varchar("superAdminPhone").notNull(),
  superAdminPassword: varchar("superAdminPassword").notNull(),
  meta: jsonb("meta"),
  isApproved: boolean("isApproved").default(false),
  isSuspended: boolean("isSuspended").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users table (all roles: super admins, teachers, students, parents)
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(), // Ties user to a school
  role: roleEnum("role").notNull(),
  username: varchar("username", { length: 100 }).unique().notNull(), // Auto-generated initially
  password: varchar("password", { length: 255 }).notNull(), // Hashed password
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Students table (specific student data)
export const studentsTable = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => usersTable.id)
      .notNull()
      .unique(), // Links to users table
    schoolId: uuid("school_id")
      .references(() => schoolsTable.id, { onDelete: "cascade" })
      .notNull(),
    srNo: varchar("sr_no", { length: 50 }).notNull(), // Unique student ID per school
    dateOfBirth: timestamp("date_of_birth"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull()
    .unique(),
  schoolId: uuid("school_id")
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Teacher-School history (handles teacher school switches)
export const teacherSchoolHistoryTable = pgTable("teacher_school_history", {
  id: serial("id").primaryKey(),
  teacherId: uuid("teacher_id")
    .references(() => teachersTable.id)
    .notNull(),
  schoolId: uuid("school_id")
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"), // Null if currently employed
});

// Academic sessions (e.g., 2025-2026)
export const sessionsTable = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "2025-2026"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Classes (e.g., Grade 10)
export const classesTable = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Grade 10"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sections (e.g., 10A, 10B)
export const sectionsTable = pgTable("sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  classId: uuid("class_id")
    .references(() => classesTable.id)
    .notNull(),
  name: varchar("name", { length: 50 }).notNull(), // e.g., "10A"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student-Class assignments (links students to classes/sections per session)
export const studentClassesTable = pgTable(
  "student_classes",
  {
    id: serial("id").primaryKey(),
    studentId: uuid("student_id")
      .references(() => studentsTable.id)
      .notNull(),
    classId: uuid("class_id")
      .references(() => classesTable.id, { onDelete: "cascade" })
      .notNull(),
    sectionId: uuid("section_id")
      .references(() => sectionsTable.id)
      .notNull(),
    sessionId: uuid("session_id")
      .references(() => sessionsTable.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
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
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Annual Tuition"
  amount: integer("amount").notNull(),
  sessionId: uuid("session_id")
    .references(() => sessionsTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student fee assignments
export const studentFeesTable = pgTable("student_fees", {
  id: serial("id").primaryKey(),
  studentId: uuid("student_id")
    .references(() => studentsTable.id, { onDelete: "cascade" })
    .notNull(),
  feeStructureId: uuid("fee_structure_id")
    .references(() => feeStructuresTable.id)
    .notNull(),
  amountPaid: integer("amount_paid").default(0).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const schoolsRelations = relations(schoolsTable, ({ many }) => ({
  users: many(usersTable),
  students: many(studentsTable),
  teachers: many(teachersTable),
  sessions: many(sessionsTable),
  classes: many(classesTable),
  feeStructures: many(feeStructuresTable),
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
}));

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
  studentClasses: many(studentClassesTable),
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
