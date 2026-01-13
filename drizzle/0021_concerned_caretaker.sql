ALTER TABLE "users" ALTER COLUMN "phone" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "notif_plan_instance" ADD COLUMN "isExhausted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "notif_plan_instance" ADD COLUMN "isActive" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "notif_plan_instance" DROP COLUMN "isInActive";--> statement-breakpoint
ALTER TABLE "notif_plan_instance" DROP COLUMN "isLive";--> statement-breakpoint
ALTER TABLE "notif_plan_instance" DROP COLUMN "isQueued";--> statement-breakpoint
ALTER TABLE "notif_plan_instance" DROP COLUMN "queuedOrder";