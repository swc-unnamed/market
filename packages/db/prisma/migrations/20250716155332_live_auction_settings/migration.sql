/*
  Warnings:

  - You are about to drop the `auction_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "auction_events";

-- CreateTable
CREATE TABLE "live_auction_settings" (
    "id" TEXT NOT NULL,
    "broadcast_webhook" TEXT NOT NULL,

    CONSTRAINT "live_auction_settings_pkey" PRIMARY KEY ("id")
);
