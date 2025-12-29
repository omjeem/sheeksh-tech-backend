ALTER TABLE "notification" ALTER COLUMN "createdBy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notification_category" ADD COLUMN "createdBy" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notification_category" ADD CONSTRAINT "notification_category_createdBy_schools_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;