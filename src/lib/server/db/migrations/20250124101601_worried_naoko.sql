ALTER TABLE "asset_ledger" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "asset_ledger" ADD COLUMN "value" integer;--> statement-breakpoint
ALTER TABLE "asset_ledger" DROP COLUMN "listed_price";--> statement-breakpoint
ALTER TABLE "asset_ledger" DROP COLUMN "sold_price";--> statement-breakpoint
ALTER TABLE "asset_ledger" DROP COLUMN "sold_to_id";