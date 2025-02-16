/*
  Warnings:

  - You are about to alter the column `value` on the `asset_ledger` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "asset_ledger" ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "value" SET DATA TYPE INTEGER;
