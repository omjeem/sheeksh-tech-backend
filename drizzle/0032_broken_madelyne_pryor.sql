CREATE TABLE "notification_recipient_ack" (
	"id" serial PRIMARY KEY NOT NULL,
	"notificationId" uuid NOT NULL,
	"reciepntId" uuid NOT NULL,
	"ackId" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification_recipient_ack" ADD CONSTRAINT "notification_recipient_ack_notificationId_notification_id_fk" FOREIGN KEY ("notificationId") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipient_ack" ADD CONSTRAINT "notification_recipient_ack_reciepntId_notification_recipient_id_fk" FOREIGN KEY ("reciepntId") REFERENCES "public"."notification_recipient"("id") ON DELETE cascade ON UPDATE no action;