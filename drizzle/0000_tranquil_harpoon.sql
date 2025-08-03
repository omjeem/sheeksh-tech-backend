CREATE TABLE "school_master" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text,
	"phone" varchar(20),
	"email" varchar(255) NOT NULL,
	"website" varchar(255),
	"super_admin_name" varchar(255) NOT NULL,
	"super_admin_email" varchar(255) NOT NULL,
	"super_admin_password_hash" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "school_master_email_unique" UNIQUE("email"),
	CONSTRAINT "school_master_super_admin_email_unique" UNIQUE("super_admin_email")
);
