ALTER TABLE "notification_category" DROP CONSTRAINT "notification_category_createdBy_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_category" ADD CONSTRAINT "notification_category_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;