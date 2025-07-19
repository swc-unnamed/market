-- CreateEnum
CREATE TYPE "auction_live_status" AS ENUM ('Upcoming', 'InProgress', 'Completed', 'Cancelled', 'Closed');

-- AlterTable
ALTER TABLE "auction_lives" ADD COLUMN     "status" "auction_live_status" NOT NULL DEFAULT 'Upcoming';
