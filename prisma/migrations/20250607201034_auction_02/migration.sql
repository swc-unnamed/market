-- CreateTable
CREATE TABLE "auction_listing_items" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "uuu" BOOLEAN NOT NULL DEFAULT true,
    "unique" BOOLEAN NOT NULL DEFAULT false,
    "customName" TEXT,
    "customImage" TEXT,
    "imported" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_listing_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auction_listing_items" ADD CONSTRAINT "auction_listing_items_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "auction_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_listing_items" ADD CONSTRAINT "auction_listing_items_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
