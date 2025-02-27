-- CreateEnum
CREATE TYPE "IntegrationScope" AS ENUM ('user_read', 'user_create');

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scopes" "IntegrationScope"[],
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approved_by" TEXT,
    "access_token" TEXT NOT NULL,
    "registered_by" TEXT NOT NULL,
    "last_used" TIMESTAMP(3),
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "integrations_access_token_key" ON "integrations"("access_token");

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_registered_by_fkey" FOREIGN KEY ("registered_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
