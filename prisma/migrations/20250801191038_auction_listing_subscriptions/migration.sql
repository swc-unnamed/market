-- CreateTable
CREATE TABLE "auction_listing_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,

    CONSTRAINT "auction_listing_subscriptions_pkey" PRIMARY KEY ("id")
);
