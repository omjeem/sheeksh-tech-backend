import { relations } from "drizzle-orm";
import { integer } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { pgTable, serial, varchar, timestamp, text, boolean } from "drizzle-orm/pg-core";

export const staffRoleEnum = pgEnum("staff_role", [
  "teacher",
  "principal",
  "accountant",
  "clerk",
  "librarian",
]);

export const teachingGradeEnum = pgEnum("teaching_grade", [
  "TGT", // Trained Graduate Teacher
  "PGT", // Post Graduate Teacher
  "NA",  // Not applicable for non-teachers
]);


export const school_master = pgTable("school_master", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  website: varchar("website", { length: 255 }),

  superAdminName: varchar("super_admin_name", { length: 255 }).notNull(),
  superAdminEmail: varchar("super_admin_email", { length: 255 }).notNull().unique(),
  superAdminPassword: varchar("super_admin_password", { length: 255 }).notNull(),

  isVerified: boolean("is_verified").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const staffProfiles_master = pgTable("staff_profiles_master", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }),
  qualifications: text("qualifications"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const schoolStaffEmployment = pgTable("school_staff_employment", {
  id: serial("id").primaryKey(),

  // Foreign keys
  staffId: integer("staff_id").references(() => staffProfiles_master.id).notNull(),
  schoolId: integer("school_id").references(() => school_master.id).notNull(),

  role: staffRoleEnum("role").notNull(),
  teachingGrade: teachingGradeEnum("teaching_grade").default("NA"),

  joinDate: timestamp("join_date").notNull(),
  resignDate: timestamp("resign_date"),

  isCurrentlyEmployed: boolean("is_currently_employed").default(true),
  salary: integer("salary"), // store in lowest unit (e.g., paise)

  createdAt: timestamp("created_at").defaultNow(),
});


// ⛳️ school_master ↔ school_staff_employment
export const schoolRelations = relations(school_master, ({ many }) => ({
  staffEmployments: many(schoolStaffEmployment),
}));

// ⛳️ staffProfiles_master ↔ school_staff_employment
export const staffProfileRelations = relations(staffProfiles_master, ({ many }) => ({
  employments: many(schoolStaffEmployment),
}));

// ⛳️ school_staff_employment ↔ school + staff
export const schoolStaffEmploymentRelations = relations(schoolStaffEmployment, ({ one }) => ({
  school: one(school_master, {
    fields: [schoolStaffEmployment.schoolId],
    references: [school_master.id],
  }),
  staff: one(staffProfiles_master, {
    fields: [schoolStaffEmployment.staffId],
    references: [staffProfiles_master.id],
  }),
}));
