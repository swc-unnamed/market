ALTER TABLE "auction_listings" ALTER COLUMN "starting_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "auction_listings" ALTER COLUMN "location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "auction_listings" ALTER COLUMN "sent_credits_to_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "auction_listings" ALTER COLUMN "status" SET DEFAULT 'draft';