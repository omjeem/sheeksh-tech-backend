ALTER TABLE "notif_plan_feature_limit" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "notif_plan_feature_limit" CASCADE;--> statement-breakpoint
ALTER TABLE "notif_channel_usage_limit" ALTER COLUMN "frequency" SET NOT NULL;