ALTER TABLE "notif_plan_instance" RENAME COLUMN "displayName" TO "description";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP CONSTRAINT "notif_purchased_channel_schoolId_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP CONSTRAINT "notif_purchased_channel_purchaseId_notif_plan_transactions_id_fk";
--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP CONSTRAINT "notif_purchased_channel_planId_notif_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "notif_plan_transactions" DROP CONSTRAINT "notif_plan_transactions_schoolId_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "notif_plan_transactions" DROP CONSTRAINT "notif_plan_transactions_planId_notif_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "notif_plan_instance" ADD COLUMN "schoolId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notif_plan_instance" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "notif_plan_instance" ADD COLUMN "isActive" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "notif_plan_instance" ADD COLUMN "queuedOrder" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" ADD COLUMN "limits" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "notif_plan_transactions" ADD COLUMN "planInstanceId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notif_plan_instance" ADD CONSTRAINT "notif_plan_instance_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_plan_transactions" ADD CONSTRAINT "notif_plan_transactions_planInstanceId_notif_plan_instance_id_fk" FOREIGN KEY ("planInstanceId") REFERENCES "public"."notif_plan_instance"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_plan_instance" DROP COLUMN "durationDays";--> statement-breakpoint
ALTER TABLE "notif_plan_instance" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "notif_plan_instance" DROP COLUMN "queuedPriority";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "schoolId";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "purchaseId";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "planId";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "planOptionKey";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "unitsReserved";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "startAt";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "endAt";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "isActive";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "isQueued";--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" DROP COLUMN "queuedOrder";--> statement-breakpoint
ALTER TABLE "notif_plan_transactions" DROP COLUMN "schoolId";--> statement-breakpoint
ALTER TABLE "notif_plan_transactions" DROP COLUMN "planId";