ALTER TABLE "auction_listings" ADD COLUMN "is_deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "auction_listings" ADD COLUMN "deleted_at" timestamp;