ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "isDeleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "username";