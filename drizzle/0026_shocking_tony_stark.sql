CREATE TABLE "notif_channel_usage_limit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schoolId" uuid,
	"orgType" varchar(30) NOT NULL,
	"channel" varchar(30),
	"frequency" varchar(30),
	"limit" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_org_limit" UNIQUE("schoolId","frequency")
);
--> statement-breakpoint
ALTER TABLE "notif_channel_usage_limit" ADD CONSTRAINT "notif_channel_usage_limit_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;