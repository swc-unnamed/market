/*
  Warnings:

  - You are about to alter the column `reputation` on the `organizations` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `reputation` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- CreateEnum
CREATE TYPE "auction_listing_status" AS ENUM ('Draft', 'Active', 'Sold', 'Cancelled', 'Expired', 'PendingPayment', 'PendingMakeover', 'PendingVerification', 'Complete');

-- CreateEnum
CREATE TYPE "auction_listing_types" AS ENUM ('Live', 'Standard', 'Private');

-- AlterTable
ALTER TABLE "entity_ledgers" ALTER COLUMN "value" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "reputation" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "reputation" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "profile_reputation_ledgers" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_reputation_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_lives" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "moderatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "auction_lives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_listings" (
    "id" TEXT NOT NULL,
    "listingNumber" SERIAL NOT NULL,
    "status" "auction_listing_status" NOT NULL DEFAULT 'Draft',
    "type" "auction_listing_types" NOT NULL DEFAULT 'Live',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "minimumBid" INTEGER NOT NULL DEFAULT 100000,
    "creatorId" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "creditsRecipient" TEXT NOT NULL,
    "winnerId" TEXT,
    "organizationId" TEXT,
    "liveAuctionId" TEXT,
    "allowBuyNow" BOOLEAN NOT NULL DEFAULT false,
    "buyNowPrice" TEXT,
    "winningBidAmount" INTEGER DEFAULT 0,

    CONSTRAINT "auction_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_bids" (
    "id" TEXT NOT NULL,
    "auctionListingId" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_reviews" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "auction_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_profile_reputation_ledgers_profile_id" ON "profile_reputation_ledgers"("profileId");

-- CreateIndex
CREATE INDEX "idx_profile_reputation_ledgers_timestamp" ON "profile_reputation_ledgers"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "auction_listings_listingNumber_key" ON "auction_listings"("listingNumber");

-- AddForeignKey
ALTER TABLE "profile_reputation_ledgers" ADD CONSTRAINT "profile_reputation_ledgers_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_lives" ADD CONSTRAINT "auction_lives_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_liveAuctionId_fkey" FOREIGN KEY ("liveAuctionId") REFERENCES "auction_lives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_auctionListingId_fkey" FOREIGN KEY ("auctionListingId") REFERENCES "auction_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_reviews" ADD CONSTRAINT "auction_reviews_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "auction_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
