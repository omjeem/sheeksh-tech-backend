CREATE TABLE "notif_plan_feature_limit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"planFeatureId" uuid NOT NULL,
	"period" varchar(20) NOT NULL,
	"maxUnits" integer NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notif_plan_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"planId" uuid NOT NULL,
	"channel" varchar(20) NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notif_plan_instance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"planId" uuid NOT NULL,
	"key" varchar(191),
	"displayName" varchar(255),
	"durationDays" integer,
	"isQueued" boolean DEFAULT false NOT NULL,
	"price" integer NOT NULL,
	"queuedPriority" integer DEFAULT 100 NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notif_purchased_channel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schoolId" uuid NOT NULL,
	"purchaseId" uuid NOT NULL,
	"planId" uuid NOT NULL,
	"planInstanceId" uuid NOT NULL,
	"planOptionKey" varchar(191),
	"channel" varchar(20) NOT NULL,
	"unitsTotal" integer NOT NULL,
	"unitsConsumed" integer DEFAULT 0 NOT NULL,
	"unitsReserved" integer DEFAULT 0 NOT NULL,
	"startAt" timestamp,
	"endAt" timestamp,
	"isActive" boolean DEFAULT false NOT NULL,
	"isQueued" boolean DEFAULT false NOT NULL,
	"queuedOrder" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notif_plan_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schoolId" uuid NOT NULL,
	"planId" uuid NOT NULL,
	"purchasedBy" uuid,
	"totalPrice" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'INR',
	"paymentProvider" varchar(100),
	"providerTxId" varchar(255),
	"status" varchar(30) DEFAULT 'PENDING' NOT NULL,
	"requestedActivateAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "notif_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(191) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"planType" varchar(255) DEFAULT 'PUBLIC' NOT NULL,
	"basePrice" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'INR',
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notif_plans_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "notif_aggregate_balance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schoolId" uuid NOT NULL,
	"channel" varchar(20) NOT NULL,
	"totalPurchased" integer DEFAULT 0 NOT NULL,
	"totalConsumed" integer DEFAULT 0 NOT NULL,
	"available" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notif_school_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schoolId" uuid NOT NULL,
	"purchasedChannelId" uuid,
	"notificationId" uuid,
	"channel" varchar(20) NOT NULL,
	"delta" integer NOT NULL,
	"creditsUsed" integer NOT NULL,
	"reason" varchar(40) NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notif_system_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel" varchar(20) NOT NULL,
	"provider" varchar(191),
	"providerInvoiceId" varchar(255),
	"unitsPurchased" integer NOT NULL,
	"unitsConsumed" integer DEFAULT 0 NOT NULL,
	"available" integer NOT NULL,
	"purchasedAt" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notif_plan_feature_limit" ADD CONSTRAINT "notif_plan_feature_limit_planFeatureId_notif_plan_features_id_fk" FOREIGN KEY ("planFeatureId") REFERENCES "public"."notif_plan_features"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_plan_features" ADD CONSTRAINT "notif_plan_features_planId_notif_plans_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."notif_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_plan_instance" ADD CONSTRAINT "notif_plan_instance_planId_notif_plans_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."notif_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" ADD CONSTRAINT "notif_purchased_channel_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" ADD CONSTRAINT "notif_purchased_channel_purchaseId_notif_plan_transactions_id_fk" FOREIGN KEY ("purchaseId") REFERENCES "public"."notif_plan_transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" ADD CONSTRAINT "notif_purchased_channel_planId_notif_plans_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."notif_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_purchased_channel" ADD CONSTRAINT "notif_purchased_channel_planInstanceId_notif_plan_instance_id_fk" FOREIGN KEY ("planInstanceId") REFERENCES "public"."notif_plan_instance"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_plan_transactions" ADD CONSTRAINT "notif_plan_transactions_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_plan_transactions" ADD CONSTRAINT "notif_plan_transactions_planId_notif_plans_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."notif_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_plan_transactions" ADD CONSTRAINT "notif_plan_transactions_purchasedBy_users_id_fk" FOREIGN KEY ("purchasedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_aggregate_balance" ADD CONSTRAINT "notif_aggregate_balance_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_school_ledger" ADD CONSTRAINT "notif_school_ledger_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_school_ledger" ADD CONSTRAINT "notif_school_ledger_purchasedChannelId_notif_purchased_channel_id_fk" FOREIGN KEY ("purchasedChannelId") REFERENCES "public"."notif_purchased_channel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notif_school_ledger" ADD CONSTRAINT "notif_school_ledger_notificationId_notification_id_fk" FOREIGN KEY ("notificationId") REFERENCES "public"."notification"("id") ON DELETE no action ON UPDATE no action;