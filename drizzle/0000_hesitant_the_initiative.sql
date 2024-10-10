CREATE TABLE IF NOT EXISTS "placely-backoffice_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "placely-backoffice_website" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"template" varchar(10) NOT NULL,
	"primaryColor" varchar(10) NOT NULL,
	"title" varchar(256) NOT NULL,
	"user_id" integer,
	"status" varchar(30) DEFAULT 'undeployed' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "placely-backoffice_website" ADD CONSTRAINT "placely-backoffice_website_user_id_placely-backoffice_post_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."placely-backoffice_post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "placely-backoffice_post" USING btree ("name");