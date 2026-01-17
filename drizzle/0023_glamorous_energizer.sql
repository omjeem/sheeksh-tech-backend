ALTER TABLE "notif_school_ledger" DROP CONSTRAINT "notif_school_ledger_purchasedChannelId_notif_purchased_channel_id_fk";
--> statement-breakpoint
ALTER TABLE "notif_school_ledger" ALTER COLUMN "creditsUsed" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "notif_school_ledger" ADD COLUMN "planInstanceId" uuid;--> statement-breakpoint
ALTER TABLE "notif_school_ledger" ADD COLUMN "channelId" uuid;--> statement-breakpoint
ALTER TABLE "notif_school_ledger" ADD COLUMN "operation" varchar(40) NOT NULL;--> statement-breakpoint
ALTER TABLE "notif_school_ledger" ADD CONSTRAINT "notif_school_ledger_planInstanceId_notif_plan_instance_id_fk" FOREIGN KEY ("planInstanceId") REFERENCES "public"."notif_plan_instance"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_school_ledger" ADD CONSTRAINT "notif_school_ledger_channelId_notif_purchased_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."notif_purchased_channel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_school_ledger" DROP COLUMN "purchasedChannelId";--> statement-breakpoint
ALTER TABLE "notif_school_ledger" DROP COLUMN "channel";--> statement-breakpoint
ALTER TABLE "notif_school_ledger" DROP COLUMN "delta";--> statement-breakpoint
ALTER TABLE "notif_school_ledger" DROP COLUMN "reason";