ALTER TABLE "classes" DROP CONSTRAINT "classes_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "fee_structures" DROP CONSTRAINT "fee_structures_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "sections" DROP CONSTRAINT "sections_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "student_classes" DROP CONSTRAINT "student_classes_class_id_classes_id_fk";
--> statement-breakpoint
ALTER TABLE "student_fees" DROP CONSTRAINT "student_fees_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "teacher_school_history" DROP CONSTRAINT "teacher_school_history_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "phone" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "superAdminName" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "superAdminEmail" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "superAdminPhone" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "superAdminPassword" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_classes" ADD CONSTRAINT "student_classes_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_school_history" ADD CONSTRAINT "teacher_school_history_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;