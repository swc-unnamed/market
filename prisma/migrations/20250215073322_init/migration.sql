-- CreateEnum
CREATE TYPE "Role" AS ENUM ('patron', 'auctioneer', 'holochain_architect', 'market_tzar');

-- CreateEnum
CREATE TYPE "WebhookType" AS ENUM ('discord');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('droids', 'creatures', 'items', 'vehicles', 'weapons', 'facilities', 'ships', 'stations', 'materials', 'npcs');

-- CreateEnum
CREATE TYPE "AssetLedgerAction" AS ENUM ('auction_listed', 'auction_sold', 'market_listed', 'market_sold');

-- CreateEnum
CREATE TYPE "AuctionListingStatus" AS ENUM ('new', 'selected', 'sold', 'completed');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('pending', 'started', 'closed');

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "combine_id" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,
    "custom_image_url" TEXT,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_ledger" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "action" "AssetLedgerAction" NOT NULL,
    "value" BIGINT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_listing_items" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT,
    "entity_id" TEXT NOT NULL,
    "uuu" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "is_custom_item" BOOLEAN NOT NULL DEFAULT false,
    "custom_name" TEXT,
    "custom_image" TEXT,
    "unique_item" BOOLEAN NOT NULL DEFAULT false,
    "auction_listing_id" TEXT NOT NULL,

    CONSTRAINT "auction_listing_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_listings" (
    "id" TEXT NOT NULL,
    "listingNumber" SERIAL NOT NULL,
    "listed_by_id" TEXT NOT NULL,
    "starting_bid" BIGINT NOT NULL,
    "winning_bid" BIGINT NOT NULL,
    "winning_bidder_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "send_credits_to" TEXT NOT NULL,
    "anonymous_listing" BOOLEAN NOT NULL DEFAULT false,
    "status" "AuctionListingStatus" NOT NULL DEFAULT 'new',
    "completed_at" TIMESTAMP(3),
    "auction_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auctions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "AuctionStatus" NOT NULL DEFAULT 'pending',
    "start_at" TIMESTAMP(3) NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,
    "uid" TEXT NOT NULL,
    "api_link" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "auction_webhook_url" TEXT,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "combine_id" TEXT NOT NULL,
    "discord_id" TEXT,
    "avatar" TEXT,
    "scopes" TEXT[],
    "join_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'patron',
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "banned_reason" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWebhook" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "WebhookType" NOT NULL,
    "webhook" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(3),
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "failure_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entities_uid_key" ON "entities"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_combine_id_key" ON "users"("combine_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_id_key" ON "users"("discord_id");

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_ledger" ADD CONSTRAINT "asset_ledger_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listing_items" ADD CONSTRAINT "auction_listing_items_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listing_items" ADD CONSTRAINT "auction_listing_items_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listing_items" ADD CONSTRAINT "auction_listing_items_auction_listing_id_fkey" FOREIGN KEY ("auction_listing_id") REFERENCES "auction_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_listed_by_id_fkey" FOREIGN KEY ("listed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_winning_bidder_id_fkey" FOREIGN KEY ("winning_bidder_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWebhook" ADD CONSTRAINT "UserWebhook_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
