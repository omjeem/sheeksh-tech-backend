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

// Enum for user roles

enum UserRoles {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
  ACCOUNTANT = "ACCOUNTANT",
  CLASS_TEACHER = "CLASS_TEACHER"
}
export const roleEnum = pgEnum("role", UserRoles);

// Schools table (multi-tenant entity)
export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).unique().notNull(), // e.g., school-specific subdomain
  address: text("address").notNull(),
  isApproved: boolean("isApproved").default(false),
  isSuspended: boolean("isSuspended").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users table (all roles: super admins, teachers, students, parents)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schools.id)
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
export const students = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull()
      .unique(), // Links to users table
    schoolId: uuid("school_id")
      .references(() => schools.id)
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
export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
  schoolId: uuid("school_id")
    .references(() => schools.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Teacher-School history (handles teacher school switches)
export const teacherSchoolHistory = pgTable("teacher_school_history", {
  id: serial("id").primaryKey(),
  teacherId: uuid("teacher_id")
    .references(() => teachers.id)
    .notNull(),
  schoolId: uuid("school_id")
    .references(() => schools.id)
    .notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"), // Null if currently employed
});

// Academic sessions (e.g., 2025-2026)
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schools.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "2025-2026"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Classes (e.g., Grade 10)
export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schools.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Grade 10"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sections (e.g., 10A, 10B)
export const sections = pgTable("sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schools.id)
    .notNull(),
  classId: uuid("class_id")
    .references(() => classes.id)
    .notNull(),
  name: varchar("name", { length: 50 }).notNull(), // e.g., "10A"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student-Class assignments (links students to classes/sections per session)
export const studentClasses = pgTable(
  "student_classes",
  {
    id: serial("id").primaryKey(),
    studentId: uuid("student_id")
      .references(() => students.id)
      .notNull(),
    classId: uuid("class_id")
      .references(() => classes.id)
      .notNull(),
    sectionId: uuid("section_id")
      .references(() => sections.id)
      .notNull(),
    sessionId: uuid("session_id")
      .references(() => sessions.id)
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
export const feeStructures = pgTable("fee_structures", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .references(() => schools.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Annual Tuition"
  amount: integer("amount").notNull(),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student fee assignments
export const studentFees = pgTable("student_fees", {
  id: serial("id").primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  feeStructureId: uuid("fee_structure_id")
    .references(() => feeStructures.id)
    .notNull(),
  amountPaid: integer("amount_paid").default(0).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const schoolsRelations = relations(schools, ({ many }) => ({
  users: many(users),
  students: many(students),
  teachers: many(teachers),
  sessions: many(sessions),
  classes: many(classes),
  feeStructures: many(feeStructures),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  teacher: one(teachers, {
    fields: [users.id],
    references: [teachers.userId],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [students.schoolId],
    references: [schools.id],
  }),
  studentClasses: many(studentClasses),
  studentFees: many(studentFees),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [teachers.schoolId],
    references: [schools.id],
  }),
  history: many(teacherSchoolHistory),
}));

export const teacherSchoolHistoryRelations = relations(
  teacherSchoolHistory,
  ({ one }) => ({
    teacher: one(teachers, {
      fields: [teacherSchoolHistory.teacherId],
      references: [teachers.id],
    }),
    school: one(schools, {
      fields: [teacherSchoolHistory.schoolId],
      references: [schools.id],
    }),
  })
);

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  school: one(schools, {
    fields: [sessions.schoolId],
    references: [schools.id],
  }),
  studentClasses: many(studentClasses),
  feeStructures: many(feeStructures),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  school: one(schools, {
    fields: [classes.schoolId],
    references: [schools.id],
  }),
  sections: many(sections),
  studentClasses: many(studentClasses),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  class: one(classes, {
    fields: [sections.classId],
    references: [classes.id],
  }),
  school: one(schools, {
    fields: [sections.schoolId],
    references: [schools.id],
  }),
  studentClasses: many(studentClasses),
}));

export const studentClassesRelations = relations(studentClasses, ({ one }) => ({
  student: one(students, {
    fields: [studentClasses.studentId],
    references: [students.id],
  }),
  class: one(classes, {
    fields: [studentClasses.classId],
    references: [classes.id],
  }),
  section: one(sections, {
    fields: [studentClasses.sectionId],
    references: [sections.id],
  }),
  session: one(sessions, {
    fields: [studentClasses.sessionId],
    references: [sessions.id],
  }),
}));

export const feeStructuresRelations = relations(
  feeStructures,
  ({ one, many }) => ({
    school: one(schools, {
      fields: [feeStructures.schoolId],
      references: [schools.id],
    }),
    session: one(sessions, {
      fields: [feeStructures.sessionId],
      references: [sessions.id],
    }),
    studentFees: many(studentFees),
  })
);

export const studentFeesRelations = relations(studentFees, ({ one }) => ({
  student: one(students, {
    fields: [studentFees.studentId],
    references: [students.id],
  }),
  feeStructure: one(feeStructures, {
    fields: [studentFees.feeStructureId],
    references: [feeStructures.id],
  }),
}));
