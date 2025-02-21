/*
  Warnings:

  - A unique constraint covering the columns `[combine_id]` on the table `assets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "assets_combine_id_key" ON "assets"("combine_id");
