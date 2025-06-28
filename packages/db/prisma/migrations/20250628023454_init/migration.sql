-- CreateEnum
CREATE TYPE "roles" AS ENUM ('Patron', 'Auctioneer', 'Developer', 'Tzar');

-- CreateEnum
CREATE TYPE "auction_listing_status" AS ENUM ('Draft', 'Active', 'Sold', 'Cancelled', 'Expired', 'PendingPayment', 'PendingMakeover', 'PendingVerification', 'Complete');

-- CreateEnum
CREATE TYPE "auction_listing_types" AS ENUM ('Live', 'Standard', 'Private');

-- CreateEnum
CREATE TYPE "entity_ledger_types" AS ENUM ('Auction', 'Marketplace');

-- CreateEnum
CREATE TYPE "organization_roles" AS ENUM ('Patron', 'Member', 'Admin', 'Owner');

-- CreateTable
CREATE TABLE "auction_lives" (
    "id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "moderator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "auction_lives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_listings" (
    "id" TEXT NOT NULL,
    "listing_number" SERIAL NOT NULL,
    "status" "auction_listing_status" NOT NULL DEFAULT 'Draft',
    "type" "auction_listing_types" NOT NULL DEFAULT 'Live',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "minimum_bid" INTEGER NOT NULL DEFAULT 100000,
    "creator_id" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "credits_recipient" TEXT NOT NULL,
    "winner_id" TEXT,
    "organization_id" TEXT,
    "live_auction_id" TEXT,
    "allow_buy_now" BOOLEAN NOT NULL DEFAULT false,
    "buy_now_price" TEXT,
    "winning_bid_amount" INTEGER DEFAULT 0,

    CONSTRAINT "auction_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_listing_items" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "uuu" BOOLEAN NOT NULL DEFAULT true,
    "unique" BOOLEAN NOT NULL DEFAULT false,
    "custom_name" TEXT,
    "custom_image" TEXT,
    "imported" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_listing_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_bids" (
    "id" TEXT NOT NULL,
    "auction_listing_id" TEXT NOT NULL,
    "bidder_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_reviews" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "reviewee_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "auction_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_events" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "href" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_access" (
    "id" TEXT NOT NULL,
    "combine_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "combine_uid" TEXT NOT NULL,
    "combine_href" TEXT NOT NULL,
    "combine_data" JSONB NOT NULL,
    "image_small" TEXT NOT NULL,
    "image_large" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_ledgers" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "type" "entity_ledger_types" NOT NULL,
    "value" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entity_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "website_url" TEXT,
    "discord_url" TEXT,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "role" "organization_roles" NOT NULL DEFAULT 'Patron',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "combine_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "combine_scopes" TEXT[] DEFAULT ARRAY['character_read']::TEXT[],
    "discord_id" TEXT,
    "discord_username" TEXT,
    "role" "roles" NOT NULL DEFAULT 'Patron',
    "api_key" TEXT NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "banned_reason" TEXT,
    "banned_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "avatar" TEXT,
    "biography" TEXT,
    "reputation" INTEGER NOT NULL DEFAULT 50,
    "active_membership_id" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_reputation_ledgers" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_reputation_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auction_listings_listing_number_key" ON "auction_listings"("listing_number");

-- CreateIndex
CREATE UNIQUE INDEX "beta_access_combine_id_key" ON "beta_access"("combine_id");

-- CreateIndex
CREATE UNIQUE INDEX "entities_combine_uid_key" ON "entities"("combine_uid");

-- CreateIndex
CREATE INDEX "idx_entity_ledgers_entity_id" ON "entity_ledgers"("entity_id");

-- CreateIndex
CREATE INDEX "idx_entity_ledgers_timestamp" ON "entity_ledgers"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_organization_id_profile_id_key" ON "organization_members"("organization_id", "profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_combine_id_key" ON "users"("combine_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_id_key" ON "users"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_api_key_key" ON "users"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "idx_profile_reputation_ledgers_profile_id" ON "profile_reputation_ledgers"("profile_id");

-- CreateIndex
CREATE INDEX "idx_profile_reputation_ledgers_timestamp" ON "profile_reputation_ledgers"("timestamp");

-- AddForeignKey
ALTER TABLE "auction_lives" ADD CONSTRAINT "auction_lives_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_live_auction_id_fkey" FOREIGN KEY ("live_auction_id") REFERENCES "auction_lives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listing_items" ADD CONSTRAINT "auction_listing_items_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "auction_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listing_items" ADD CONSTRAINT "auction_listing_items_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_auction_listing_id_fkey" FOREIGN KEY ("auction_listing_id") REFERENCES "auction_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_reviews" ADD CONSTRAINT "auction_reviews_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "auction_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_ledgers" ADD CONSTRAINT "entity_ledgers_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_active_membership_id_fkey" FOREIGN KEY ("active_membership_id") REFERENCES "organization_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_reputation_ledgers" ADD CONSTRAINT "profile_reputation_ledgers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
