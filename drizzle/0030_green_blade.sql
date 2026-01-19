CREATE TABLE "user_guardian" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schoolId" uuid NOT NULL,
	"childUserId" uuid NOT NULL,
	"guardianUserId" uuid NOT NULL,
	"isPrimary" boolean NOT NULL,
	"isActive" boolean DEFAULT true,
	"relation" varchar(20) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_children_guardian" UNIQUE("childUserId","guardianUserId")
);
--> statement-breakpoint
ALTER TABLE "user_guardian" ADD CONSTRAINT "user_guardian_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_guardian" ADD CONSTRAINT "user_guardian_childUserId_users_id_fk" FOREIGN KEY ("childUserId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_guardian" ADD CONSTRAINT "user_guardian_guardianUserId_users_id_fk" FOREIGN KEY ("guardianUserId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;