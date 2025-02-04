CREATE TABLE "user_webhooks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'discord' NOT NULL,
	"webhook" text NOT NULL,
	"events" text[] NOT NULL,
	CONSTRAINT "user_webhooks_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "user_webhooks" ADD CONSTRAINT "user_webhooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;