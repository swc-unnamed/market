CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"combine_id" text NOT NULL,
	"avatar" text,
	"join_date" timestamp,
	"scopes" text,
	"role" text DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_combine_id_unique" UNIQUE("combine_id")
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"uid" text NOT NULL,
	"api_link" text NOT NULL,
	CONSTRAINT "assets_id_unique" UNIQUE("id"),
	CONSTRAINT "assets_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "auction_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_number" serial NOT NULL,
	"listed_by_id" text,
	"starting_price" text,
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
	"listing_id" text,
	"asset_id" text,
	"u3" boolean,
	"quantity" integer,
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
CREATE TABLE "holochain_index" (
	"id" text PRIMARY KEY NOT NULL,
	"asset_id" text NOT NULL,
	"time" timestamp NOT NULL,
	"price" integer NOT NULL,
	CONSTRAINT "holochain_index_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_listed_by_id_users_id_fk" FOREIGN KEY ("listed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_purchased_by_id_users_id_fk" FOREIGN KEY ("purchased_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listing_history" ADD CONSTRAINT "auction_listing_history_listing_id_auction_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."auction_listings"("id") ON DELETE no action ON UPDATE no action;