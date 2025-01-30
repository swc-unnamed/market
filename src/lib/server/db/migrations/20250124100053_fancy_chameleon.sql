ALTER TABLE "auction_listings" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auction_listings" ALTER COLUMN "location" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auction_listings" ALTER COLUMN "lister_is_anon" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "auction_listings" ALTER COLUMN "lister_is_anon" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "asset_ledger" ADD COLUMN "sold_to_id" text;