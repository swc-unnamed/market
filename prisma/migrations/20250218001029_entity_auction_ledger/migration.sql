-- AlterTable
ALTER TABLE "auction_listings" ADD COLUMN     "api_imported" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "entities" ADD COLUMN     "image_large" TEXT,
ADD COLUMN     "image_small" TEXT;

-- CreateTable
CREATE TABLE "EntityAuctionLedger" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "sold_value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityAuctionLedger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EntityAuctionLedger" ADD CONSTRAINT "EntityAuctionLedger_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
