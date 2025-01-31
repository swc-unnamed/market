CREATE TABLE "system_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"auction_webhook_url" text,
	CONSTRAINT "system_settings_id_unique" UNIQUE("id")
);
