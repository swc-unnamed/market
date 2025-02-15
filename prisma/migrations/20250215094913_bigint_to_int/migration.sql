/*
  Warnings:

  - You are about to alter the column `starting_bid` on the `auction_listings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `winning_bid` on the `auction_listings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "auction_listings" ALTER COLUMN "starting_bid" SET DATA TYPE INTEGER,
ALTER COLUMN "winning_bid" SET DATA TYPE INTEGER;
