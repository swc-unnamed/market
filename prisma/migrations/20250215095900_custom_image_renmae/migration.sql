/*
  Warnings:

  - You are about to drop the column `custom_image_url` on the `assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assets" DROP COLUMN "custom_image_url",
ADD COLUMN     "custom_image" TEXT;
