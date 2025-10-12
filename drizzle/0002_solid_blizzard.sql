ALTER TABLE "schools" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "meta" jsonb;