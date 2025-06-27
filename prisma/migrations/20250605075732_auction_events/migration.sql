-- CreateTable
CREATE TABLE "auction_events" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "href" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_events_pkey" PRIMARY KEY ("id")
);
