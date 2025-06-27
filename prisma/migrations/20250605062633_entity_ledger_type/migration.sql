/*
  Warnings:

  - Added the required column `type` to the `entity_ledgers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "entity_ledger_types" AS ENUM ('Auction', 'Marketplace');

-- AlterTable
ALTER TABLE "entity_ledgers" ADD COLUMN     "type" "entity_ledger_types" NOT NULL;
