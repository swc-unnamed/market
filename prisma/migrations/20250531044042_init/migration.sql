-- CreateEnum
CREATE TYPE "roles" AS ENUM ('Patron', 'Auctioneer', 'Developer', 'Tzar');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "combineId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "combineScopes" TEXT[] DEFAULT ARRAY['character_read']::TEXT[],
    "discordId" TEXT NOT NULL,
    "discordUsername" TEXT NOT NULL,
    "role" "roles" NOT NULL DEFAULT 'Patron',
    "apiKey" TEXT NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "bannedReason" TEXT,
    "bannedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatar" TEXT,
    "biography" TEXT,
    "reputation" BIGINT NOT NULL DEFAULT 50,
    "organizationId" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_access" (
    "id" TEXT NOT NULL,
    "combineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "combineUid" TEXT NOT NULL,
    "combineHref" TEXT NOT NULL,
    "combineData" JSONB NOT NULL,
    "imageSmall" TEXT NOT NULL,
    "imageLarge" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_ledgers" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "value" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entity_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_combineId_key" ON "users"("combineId");

-- CreateIndex
CREATE UNIQUE INDEX "users_discordId_key" ON "users"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "users_apiKey_key" ON "users"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "beta_access_combineId_key" ON "beta_access"("combineId");

-- CreateIndex
CREATE UNIQUE INDEX "entities_combineUid_key" ON "entities"("combineUid");

-- CreateIndex
CREATE INDEX "idx_entity_ledgers_entity_id" ON "entity_ledgers"("entityId");

-- CreateIndex
CREATE INDEX "idx_entity_ledgers_timestamp" ON "entity_ledgers"("timestamp");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_ledgers" ADD CONSTRAINT "entity_ledgers_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
