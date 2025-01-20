CREATE TABLE "auctions" (
	"id" text PRIMARY KEY NOT NULL,
	"created_by_id" text NOT NULL,
	"start_at" timestamp NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "auctions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "auction_listings" ADD COLUMN "auction_id" text;--> statement-breakpoint
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_auction_id_auctions_id_fk" FOREIGN KEY ("auction_id") REFERENCES "public"."auctions"("id") ON DELETE no action ON UPDATE no action;