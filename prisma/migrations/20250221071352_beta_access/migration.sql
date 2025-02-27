-- CreateTable
CREATE TABLE "beta_access" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beta_access_name_key" ON "beta_access"("name");

-- CreateIndex
CREATE UNIQUE INDEX "beta_access_uid_key" ON "beta_access"("uid");
