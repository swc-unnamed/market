CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"combine_id" text NOT NULL,
	"discord_id" text,
	"avatar" text,
	"join_date" timestamp NOT NULL,
	"scopes" text[] NOT NULL,
	"role" text DEFAULT 'patron' NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"banned_reason" text,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_combine_id_unique" UNIQUE("combine_id"),
	CONSTRAINT "users_discord_id_unique" UNIQUE("discord_id")
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"uid" text NOT NULL,
	"api_link" text NOT NULL,
	CONSTRAINT "entities_id_unique" UNIQUE("id"),
	CONSTRAINT "entities_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_id" text,
	"combine_id" integer NOT NULL,
	"typeId" integer NOT NULL,
	"type" text NOT NULL,
	"custom_image_url" text,
	CONSTRAINT "assets_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "asset_ledger" (
	"id" text PRIMARY KEY NOT NULL,
	"asset_id" text NOT NULL,
	"action" text NOT NULL,
	"listed_price" integer,
	"sold_price" integer,
	"time" timestamp NOT NULL,
	CONSTRAINT "asset_ledger_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "auction_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_number" serial NOT NULL,
	"listed_by_id" text,
	"starting_price" integer NOT NULL,
	"purchased_by_id" text,
	"purchased_price" integer,
	"title" text,
	"description" text,
	"location" text,
	"sent_credits_to_id" text NOT NULL,
	"lister_is_anon" boolean,
	"created_at" timestamp,
	"status" text DEFAULT 'new',
	CONSTRAINT "auction_listings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "auction_listing_items" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"asset_id" text,
	"entity_id" text,
	"uuu" boolean,
	"quantity" integer DEFAULT 1,
	"custom_image_url" text,
	CONSTRAINT "auction_listing_items_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "auction_listing_history" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"event" text NOT NULL,
	"message" text NOT NULL,
	"time" timestamp,
	CONSTRAINT "auction_listing_history_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "asset_ledger" ADD CONSTRAINT "asset_ledger_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_listed_by_id_users_id_fk" FOREIGN KEY ("listed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_purchased_by_id_users_id_fk" FOREIGN KEY ("purchased_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listing_items" ADD CONSTRAINT "auction_listing_items_listing_id_auction_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."auction_listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listing_items" ADD CONSTRAINT "auction_listing_items_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listing_history" ADD CONSTRAINT "auction_listing_history_listing_id_auction_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."auction_listings"("id") ON DELETE no action ON UPDATE no action;