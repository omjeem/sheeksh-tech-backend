ALTER TABLE "notification_category" DROP CONSTRAINT "notification_category_schoolId_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_recipient" DROP CONSTRAINT "notification_recipient_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_category" ADD CONSTRAINT "notification_category_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipient" ADD CONSTRAINT "notification_recipient_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;