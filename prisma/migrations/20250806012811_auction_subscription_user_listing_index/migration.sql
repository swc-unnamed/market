/*
  Warnings:

  - A unique constraint covering the columns `[user_id,listing_id]` on the table `auction_listing_subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auction_listing_subscriptions_user_id_listing_id_key" ON "auction_listing_subscriptions"("user_id", "listing_id");

-- AddForeignKey
ALTER TABLE "auction_listing_subscriptions" ADD CONSTRAINT "auction_listing_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listing_subscriptions" ADD CONSTRAINT "auction_listing_subscriptions_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "auction_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
