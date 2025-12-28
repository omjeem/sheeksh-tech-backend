CREATE TABLE "notification_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schoolId" uuid NOT NULL,
	"category" varchar NOT NULL,
	"isDeleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_recipient" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notificationId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"channel" varchar,
	"payloadVariables" jsonb,
	"status" varchar DEFAULT 'PENDING' NOT NULL,
	"sentAt" timestamp,
	"deliveredAt" timestamp,
	"failedAt" timestamp,
	"seenOnPortalAt" timestamp,
	"isDeleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notificationId" uuid NOT NULL,
	"channel" varchar NOT NULL,
	"totalRecipients" integer DEFAULT 0,
	"totalSuccess" integer DEFAULT 0,
	"totalFailure" integer DEFAULT 0,
	"isDeleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schoolId" uuid NOT NULL,
	"categoryId" uuid NOT NULL,
	"name" varchar(191),
	"templatePayload" jsonb NOT NULL,
	"isDeleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schoolId" uuid NOT NULL,
	"templateId" uuid NOT NULL,
	"categoryId" uuid NOT NULL,
	"payload" jsonb,
	"channels" jsonb,
	"isDeleted" boolean DEFAULT false,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification_category" ADD CONSTRAINT "notification_category_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipient" ADD CONSTRAINT "notification_recipient_notificationId_notification_id_fk" FOREIGN KEY ("notificationId") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipient" ADD CONSTRAINT "notification_recipient_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_status" ADD CONSTRAINT "notification_status_notificationId_notification_id_fk" FOREIGN KEY ("notificationId") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_template" ADD CONSTRAINT "notification_template_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_template" ADD CONSTRAINT "notification_template_categoryId_notification_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."notification_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_templateId_notification_template_id_fk" FOREIGN KEY ("templateId") REFERENCES "public"."notification_template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_categoryId_notification_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."notification_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;