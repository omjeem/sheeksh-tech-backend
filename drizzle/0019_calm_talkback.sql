ALTER TABLE "notif_plan_instance" RENAME COLUMN "isActive" TO "isLive";--> statement-breakpoint
ALTER TABLE "notif_plan_instance" ADD COLUMN "isInActive" boolean DEFAULT false NOT NULL;