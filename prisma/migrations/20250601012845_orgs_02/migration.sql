/*
  Warnings:

  - You are about to drop the column `userId` on the `organization_members` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId,profileId]` on the table `organization_members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `organization_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_userId_fkey";

-- DropIndex
DROP INDEX "organization_members_organizationId_userId_key";

-- AlterTable
ALTER TABLE "organization_members" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "organizationId",
ADD COLUMN     "activeMembershipId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_organizationId_profileId_key" ON "organization_members"("organizationId", "profileId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_activeMembershipId_fkey" FOREIGN KEY ("activeMembershipId") REFERENCES "organization_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
