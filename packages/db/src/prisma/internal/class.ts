
/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// @ts-nocheck 
/**
 * WARNING: This is an internal file that is subject to change!
 *
 * 🛑 Under no circumstances should you import this file directly! 🛑
 *
 * Please import the `PrismaClient` class from the `client.ts` file instead.
 */

import * as runtime from "@prisma/client/runtime/client"
import type * as Prisma from "./prismaNamespace.ts"


const config: runtime.GetPrismaClientConfig = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client"
    },
    "output": {
      "value": "/Users/whodges/dev/swc-unnamed/market/packages/db/src/prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "client"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters",
      "queryCompiler",
      "relationJoins"
    ],
    "sourceFilePath": "/Users/whodges/dev/swc-unnamed/market/packages/db/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativePath": "../../prisma",
  "clientVersion": "6.10.1",
  "engineVersion": "9b628578b3b7cae625e8c927178f15a170e74a9c",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "UM_DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "model AuctionLive {\n  id          String           @id @default(cuid())\n  startTime   DateTime         @map(\"start_time\")\n  title       String\n  description String?\n  moderatorId String           @map(\"moderator_id\")\n  moderator   User             @relation(fields: [moderatorId], references: [id])\n  createdAt   DateTime         @default(now()) @map(\"created_at\")\n  endedAt     DateTime?        @map(\"ended_at\")\n  listings    AuctionListing[]\n\n  @@map(\"auction_lives\")\n}\n\nmodel AuctionListing {\n  id               String               @id @default(cuid())\n  listingNumber    Int                  @unique @default(autoincrement()) @map(\"listing_number\")\n  status           AuctionListingStatus @default(Draft)\n  type             AuctionListingType   @default(Live)\n  title            String\n  description      String\n  location         String\n  minimumBid       Int                  @default(100000) @map(\"minimum_bid\")\n  creatorId        String               @map(\"creator_id\")\n  creator          User                 @relation(\"auction_listing_created\", fields: [creatorId], references: [id])\n  anonymous        Boolean              @default(false)\n  creditsRecipient String               @map(\"credits_recipient\")\n  winnerId         String?              @map(\"winner_id\")\n  winner           User?                @relation(\"auction_listing_won\", fields: [winnerId], references: [id])\n  organizationId   String?              @map(\"organization_id\")\n  organization     Organization?        @relation(fields: [organizationId], references: [id])\n  liveAuctionId    String?              @map(\"live_auction_id\")\n  liveAuction      AuctionLive?         @relation(fields: [liveAuctionId], references: [id])\n  allowBuyNow      Boolean              @default(false) @map(\"allow_buy_now\")\n  buyNowPrice      String?              @map(\"buy_now_price\")\n  winningBidAmount Int?                 @default(0) @map(\"winning_bid_amount\")\n  bids             AuctionBid[]\n  reviews          AuctionReview[]\n  items            AuctionListingItem[]\n\n  @@map(\"auction_listings\")\n}\n\nmodel AuctionListingItem {\n  id          String         @id @default(cuid())\n  listingId   String         @map(\"listing_id\")\n  listing     AuctionListing @relation(fields: [listingId], references: [id])\n  entityId    String         @map(\"entity_id\")\n  entity      Entity         @relation(fields: [entityId], references: [id])\n  name        String\n  quantity    Int\n  uuu         Boolean        @default(true)\n  unique      Boolean        @default(false)\n  customName  String?        @map(\"custom_name\")\n  customImage String?        @map(\"custom_image\")\n  imported    Boolean        @default(false)\n  createdAt   DateTime       @default(now()) @map(\"created_at\")\n\n  @@map(\"auction_listing_items\")\n}\n\nmodel AuctionBid {\n  id               String         @id @default(cuid())\n  auctionListingId String         @map(\"auction_listing_id\")\n  auctionListing   AuctionListing @relation(fields: [auctionListingId], references: [id])\n  bidderId         String         @map(\"bidder_id\")\n  bidder           User           @relation(fields: [bidderId], references: [id])\n  amount           Int\n  createdAt        DateTime       @default(now()) @map(\"created_at\")\n\n  @@map(\"auction_bids\")\n}\n\nmodel AuctionReview {\n  id          String         @id @default(cuid())\n  listingId   String         @map(\"listing_id\")\n  listing     AuctionListing @relation(fields: [listingId], references: [id])\n  reviewerId  String         @map(\"reviewer_id\")\n  revieweeId  String         @map(\"reviewee_id\")\n  createdAt   DateTime       @default(now()) @map(\"created_at\")\n  completedAt DateTime?      @map(\"completed_at\")\n\n  @@map(\"auction_reviews\")\n}\n\nmodel AuctionEvent {\n  id        String   @id @default(cuid())\n  message   String\n  href      String?\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  @@map(\"auction_events\")\n}\n\nmodel BetaAccess {\n  id        String   @id @default(cuid())\n  combineId String   @unique @map(\"combine_id\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  @@map(\"beta_access\")\n}\n\nmodel Entity {\n  id           String               @id @default(cuid())\n  name         String\n  type         String\n  combineUid   String               @unique @map(\"combine_uid\")\n  combineHref  String               @map(\"combine_href\")\n  combineData  Json                 @map(\"combine_data\") @db.JsonB\n  imageSmall   String               @map(\"image_small\")\n  imageLarge   String               @map(\"image_large\")\n  ledgers      EntityLedger[]\n  auctionItems AuctionListingItem[]\n\n  @@map(\"entities\")\n}\n\nmodel EntityLedger {\n  id        String           @id @default(cuid())\n  entityId  String           @map(\"entity_id\")\n  entity    Entity           @relation(fields: [entityId], references: [id])\n  type      EntityLedgerType\n  value     String\n  timestamp DateTime         @default(now())\n\n  @@index([entityId], name: \"idx_entity_ledgers_entity_id\")\n  @@index([timestamp], name: \"idx_entity_ledgers_timestamp\")\n  @@map(\"entity_ledgers\")\n}\n\nenum Role {\n  Patron\n  Auctioneer\n  Developer\n  Tzar\n\n  @@map(\"roles\")\n}\n\nenum AuctionListingStatus {\n  Draft\n  Active\n  Sold\n  Cancelled\n  Expired\n  PendingPayment\n  PendingMakeover\n  PendingVerification\n  Complete\n\n  @@map(\"auction_listing_status\")\n}\n\nenum AuctionListingType {\n  Live\n  Standard\n  Private\n\n  @@map(\"auction_listing_types\")\n}\n\nenum EntityLedgerType {\n  Auction\n  Marketplace\n\n  @@map(\"entity_ledger_types\")\n}\n\nenum OrganizationRole {\n  Patron\n  Member\n  Admin\n  Owner\n\n  @@map(\"organization_roles\")\n}\n\nmodel Organization {\n  id             String               @id @default(cuid())\n  name           String               @unique\n  slug           String               @unique\n  description    String?\n  logoUrl        String?              @map(\"logo_url\")\n  reputation     Int                  @default(0)\n  websiteUrl     String?              @map(\"website_url\")\n  discordUrl     String?              @map(\"discord_url\")\n  ownerId        String               @map(\"owner_id\")\n  owner          User                 @relation(fields: [ownerId], references: [id])\n  createdAt      DateTime             @default(now()) @map(\"created_at\")\n  members        OrganizationMember[]\n  AuctionListing AuctionListing[]\n\n  @@map(\"organizations\")\n}\n\nmodel OrganizationMember {\n  id             String           @id @default(cuid())\n  organizationId String           @map(\"organization_id\")\n  organization   Organization     @relation(fields: [organizationId], references: [id])\n  profileId      String           @map(\"profile_id\")\n  profile        Profile          @relation(\"memberships\", fields: [profileId], references: [id])\n  role           OrganizationRole @default(Patron)\n  joinedAt       DateTime         @default(now()) @map(\"joined_at\")\n  activeProfiles Profile[]        @relation(\"active_membership\")\n\n  @@unique([organizationId, profileId], name: \"unique_org_member\")\n  @@map(\"organization_members\")\n}\n\nmodel User {\n  id                     String           @id @default(cuid())\n  combineId              String           @unique @map(\"combine_id\")\n  username               String\n  combineScopes          String[]         @default([\"character_read\"]) @map(\"combine_scopes\")\n  discordId              String?          @unique @map(\"discord_id\")\n  discordUsername        String?          @map(\"discord_username\")\n  role                   Role             @default(Patron)\n  apiKey                 String           @unique @default(uuid()) @map(\"api_key\")\n  banned                 Boolean          @default(false)\n  bannedReason           String?          @map(\"banned_reason\")\n  bannedDate             DateTime?        @map(\"banned_date\")\n  createdAt              DateTime         @default(now()) @map(\"created_at\")\n  updatedAt              DateTime         @updatedAt @map(\"updated_at\")\n  lastLogin              DateTime         @default(now()) @map(\"last_login\")\n  profile                Profile?\n  ownedOrganizations     Organization[]\n  moderatedLiveAuctions  AuctionLive[]\n  auctionListingsCreated AuctionListing[] @relation(\"auction_listing_created\")\n  auctionListingsWon     AuctionListing[] @relation(\"auction_listing_won\")\n  auctionBids            AuctionBid[]\n\n  @@map(\"users\")\n}\n\nmodel Profile {\n  id                 String                    @id @default(cuid())\n  userId             String                    @unique @map(\"user_id\")\n  user               User                      @relation(fields: [userId], references: [id])\n  displayName        String                    @map(\"display_name\")\n  avatar             String?\n  biography          String?\n  reputation         Int                       @default(50)\n  memberships        OrganizationMember[]      @relation(\"memberships\")\n  activeMembershipId String?                   @map(\"active_membership_id\")\n  activeMembership   OrganizationMember?       @relation(\"active_membership\", fields: [activeMembershipId], references: [id])\n  reputationLedger   ProfileReputationLedger[]\n\n  @@map(\"profiles\")\n}\n\nmodel ProfileReputationLedger {\n  id        String   @id @default(cuid())\n  profileId String   @map(\"profile_id\")\n  profile   Profile  @relation(fields: [profileId], references: [id])\n  value     Int\n  reason    String\n  timestamp DateTime @default(now())\n\n  @@index([profileId], name: \"idx_profile_reputation_ledgers_profile_id\")\n  @@index([timestamp], name: \"idx_profile_reputation_ledgers_timestamp\")\n  @@map(\"profile_reputation_ledgers\")\n}\n\ngenerator client {\n  provider        = \"prisma-client\"\n  output          = \"../src/prisma\"\n  previewFeatures = [\"queryCompiler\", \"driverAdapters\", \"relationJoins\"]\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"UM_DATABASE_URL\")\n}\n",
  "inlineSchemaHash": "24922ef8f954b45fa1f59bbd965283a053c5c4ac103ba2acdab91a01a56c4f89",
  "copyEngine": true,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "dirname": ""
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"AuctionLive\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startTime\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"start_time\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"moderatorId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"moderator_id\"},{\"name\":\"moderator\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AuctionLiveToUser\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"endedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"ended_at\"},{\"name\":\"listings\",\"kind\":\"object\",\"type\":\"AuctionListing\",\"relationName\":\"AuctionListingToAuctionLive\"}],\"dbName\":\"auction_lives\"},\"AuctionListing\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"listingNumber\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"listing_number\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AuctionListingStatus\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"AuctionListingType\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"minimumBid\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"minimum_bid\"},{\"name\":\"creatorId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"creator_id\"},{\"name\":\"creator\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"auction_listing_created\"},{\"name\":\"anonymous\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"creditsRecipient\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"credits_recipient\"},{\"name\":\"winnerId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"winner_id\"},{\"name\":\"winner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"auction_listing_won\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"organization_id\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"AuctionListingToOrganization\"},{\"name\":\"liveAuctionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"live_auction_id\"},{\"name\":\"liveAuction\",\"kind\":\"object\",\"type\":\"AuctionLive\",\"relationName\":\"AuctionListingToAuctionLive\"},{\"name\":\"allowBuyNow\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"allow_buy_now\"},{\"name\":\"buyNowPrice\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"buy_now_price\"},{\"name\":\"winningBidAmount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"winning_bid_amount\"},{\"name\":\"bids\",\"kind\":\"object\",\"type\":\"AuctionBid\",\"relationName\":\"AuctionBidToAuctionListing\"},{\"name\":\"reviews\",\"kind\":\"object\",\"type\":\"AuctionReview\",\"relationName\":\"AuctionListingToAuctionReview\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"AuctionListingItem\",\"relationName\":\"AuctionListingToAuctionListingItem\"}],\"dbName\":\"auction_listings\"},\"AuctionListingItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"listingId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"listing_id\"},{\"name\":\"listing\",\"kind\":\"object\",\"type\":\"AuctionListing\",\"relationName\":\"AuctionListingToAuctionListingItem\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"entity_id\"},{\"name\":\"entity\",\"kind\":\"object\",\"type\":\"Entity\",\"relationName\":\"AuctionListingItemToEntity\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"uuu\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"unique\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"customName\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"custom_name\"},{\"name\":\"customImage\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"custom_image\"},{\"name\":\"imported\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"}],\"dbName\":\"auction_listing_items\"},\"AuctionBid\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"auctionListingId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"auction_listing_id\"},{\"name\":\"auctionListing\",\"kind\":\"object\",\"type\":\"AuctionListing\",\"relationName\":\"AuctionBidToAuctionListing\"},{\"name\":\"bidderId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"bidder_id\"},{\"name\":\"bidder\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AuctionBidToUser\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"}],\"dbName\":\"auction_bids\"},\"AuctionReview\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"listingId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"listing_id\"},{\"name\":\"listing\",\"kind\":\"object\",\"type\":\"AuctionListing\",\"relationName\":\"AuctionListingToAuctionReview\"},{\"name\":\"reviewerId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"reviewer_id\"},{\"name\":\"revieweeId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"reviewee_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"completed_at\"}],\"dbName\":\"auction_reviews\"},\"AuctionEvent\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"message\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"href\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"}],\"dbName\":\"auction_events\"},\"BetaAccess\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"combineId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"combine_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"}],\"dbName\":\"beta_access\"},\"Entity\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"combineUid\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"combine_uid\"},{\"name\":\"combineHref\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"combine_href\"},{\"name\":\"combineData\",\"kind\":\"scalar\",\"type\":\"Json\",\"dbName\":\"combine_data\"},{\"name\":\"imageSmall\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"image_small\"},{\"name\":\"imageLarge\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"image_large\"},{\"name\":\"ledgers\",\"kind\":\"object\",\"type\":\"EntityLedger\",\"relationName\":\"EntityToEntityLedger\"},{\"name\":\"auctionItems\",\"kind\":\"object\",\"type\":\"AuctionListingItem\",\"relationName\":\"AuctionListingItemToEntity\"}],\"dbName\":\"entities\"},\"EntityLedger\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"entity_id\"},{\"name\":\"entity\",\"kind\":\"object\",\"type\":\"Entity\",\"relationName\":\"EntityToEntityLedger\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"EntityLedgerType\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"entity_ledgers\"},\"Organization\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logoUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"logo_url\"},{\"name\":\"reputation\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"websiteUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"website_url\"},{\"name\":\"discordUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"discord_url\"},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"owner_id\"},{\"name\":\"owner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"OrganizationToUser\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"OrganizationMember\",\"relationName\":\"OrganizationToOrganizationMember\"},{\"name\":\"AuctionListing\",\"kind\":\"object\",\"type\":\"AuctionListing\",\"relationName\":\"AuctionListingToOrganization\"}],\"dbName\":\"organizations\"},\"OrganizationMember\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"organization_id\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToOrganizationMember\"},{\"name\":\"profileId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"profile_id\"},{\"name\":\"profile\",\"kind\":\"object\",\"type\":\"Profile\",\"relationName\":\"memberships\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"OrganizationRole\"},{\"name\":\"joinedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"joined_at\"},{\"name\":\"activeProfiles\",\"kind\":\"object\",\"type\":\"Profile\",\"relationName\":\"active_membership\"}],\"dbName\":\"organization_members\"},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"combineId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"combine_id\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"combineScopes\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"combine_scopes\"},{\"name\":\"discordId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"discord_id\"},{\"name\":\"discordUsername\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"discord_username\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"apiKey\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"api_key\"},{\"name\":\"banned\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"bannedReason\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"banned_reason\"},{\"name\":\"bannedDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"banned_date\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"lastLogin\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"last_login\"},{\"name\":\"profile\",\"kind\":\"object\",\"type\":\"Profile\",\"relationName\":\"ProfileToUser\"},{\"name\":\"ownedOrganizations\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToUser\"},{\"name\":\"moderatedLiveAuctions\",\"kind\":\"object\",\"type\":\"AuctionLive\",\"relationName\":\"AuctionLiveToUser\"},{\"name\":\"auctionListingsCreated\",\"kind\":\"object\",\"type\":\"AuctionListing\",\"relationName\":\"auction_listing_created\"},{\"name\":\"auctionListingsWon\",\"kind\":\"object\",\"type\":\"AuctionListing\",\"relationName\":\"auction_listing_won\"},{\"name\":\"auctionBids\",\"kind\":\"object\",\"type\":\"AuctionBid\",\"relationName\":\"AuctionBidToUser\"}],\"dbName\":\"users\"},\"Profile\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ProfileToUser\"},{\"name\":\"displayName\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"display_name\"},{\"name\":\"avatar\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"biography\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reputation\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"memberships\",\"kind\":\"object\",\"type\":\"OrganizationMember\",\"relationName\":\"memberships\"},{\"name\":\"activeMembershipId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"active_membership_id\"},{\"name\":\"activeMembership\",\"kind\":\"object\",\"type\":\"OrganizationMember\",\"relationName\":\"active_membership\"},{\"name\":\"reputationLedger\",\"kind\":\"object\",\"type\":\"ProfileReputationLedger\",\"relationName\":\"ProfileToProfileReputationLedger\"}],\"dbName\":\"profiles\"},\"ProfileReputationLedger\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"profileId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"profile_id\"},{\"name\":\"profile\",\"kind\":\"object\",\"type\":\"Profile\",\"relationName\":\"ProfileToProfileReputationLedger\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"profile_reputation_ledgers\"}},\"enums\":{},\"types\":{}}")
config.engineWasm = undefined
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.postgresql.mjs"),

  getQueryCompilerWasmModule: async () => {
    const { readFile } = await import('node:fs/promises')
    const { createRequire } = await import('node:module')
    const require = createRequire(import.meta.url)

    const wasmModulePath = require.resolve("@prisma/client/runtime/query_compiler_bg.postgresql.wasm")
    const wasmModuleBytes = await readFile(wasmModulePath)

    return new globalThis.WebAssembly.Module(wasmModuleBytes)
  }
}




export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> =
  'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never

export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   * 
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more AuctionLives
   * const auctionLives = await prisma.auctionLive.findMany()
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  new <
    ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
    U = LogOptions<ClientOptions>,
    ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs
  >(options?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>): PrismaClient<ClientOptions, U, ExtArgs>
}

/**
 * ## Prisma Client
 * 
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AuctionLives
 * const auctionLives = await prisma.auctionLive.findMany()
 * ```
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */

export interface PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = LogOptions<ClientOptions>,
  ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): runtime.Types.Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): runtime.Types.Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): runtime.Types.Utils.JsPromise<R>


  $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.auctionLive`: Exposes CRUD operations for the **AuctionLive** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionLives
    * const auctionLives = await prisma.auctionLive.findMany()
    * ```
    */
  get auctionLive(): Prisma.AuctionLiveDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auctionListing`: Exposes CRUD operations for the **AuctionListing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionListings
    * const auctionListings = await prisma.auctionListing.findMany()
    * ```
    */
  get auctionListing(): Prisma.AuctionListingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auctionListingItem`: Exposes CRUD operations for the **AuctionListingItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionListingItems
    * const auctionListingItems = await prisma.auctionListingItem.findMany()
    * ```
    */
  get auctionListingItem(): Prisma.AuctionListingItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auctionBid`: Exposes CRUD operations for the **AuctionBid** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionBids
    * const auctionBids = await prisma.auctionBid.findMany()
    * ```
    */
  get auctionBid(): Prisma.AuctionBidDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auctionReview`: Exposes CRUD operations for the **AuctionReview** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionReviews
    * const auctionReviews = await prisma.auctionReview.findMany()
    * ```
    */
  get auctionReview(): Prisma.AuctionReviewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auctionEvent`: Exposes CRUD operations for the **AuctionEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionEvents
    * const auctionEvents = await prisma.auctionEvent.findMany()
    * ```
    */
  get auctionEvent(): Prisma.AuctionEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.betaAccess`: Exposes CRUD operations for the **BetaAccess** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BetaAccesses
    * const betaAccesses = await prisma.betaAccess.findMany()
    * ```
    */
  get betaAccess(): Prisma.BetaAccessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.entity`: Exposes CRUD operations for the **Entity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Entities
    * const entities = await prisma.entity.findMany()
    * ```
    */
  get entity(): Prisma.EntityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.entityLedger`: Exposes CRUD operations for the **EntityLedger** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EntityLedgers
    * const entityLedgers = await prisma.entityLedger.findMany()
    * ```
    */
  get entityLedger(): Prisma.EntityLedgerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organization`: Exposes CRUD operations for the **Organization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organization.findMany()
    * ```
    */
  get organization(): Prisma.OrganizationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organizationMember`: Exposes CRUD operations for the **OrganizationMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrganizationMembers
    * const organizationMembers = await prisma.organizationMember.findMany()
    * ```
    */
  get organizationMember(): Prisma.OrganizationMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profileReputationLedger`: Exposes CRUD operations for the **ProfileReputationLedger** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfileReputationLedgers
    * const profileReputationLedgers = await prisma.profileReputationLedger.findMany()
    * ```
    */
  get profileReputationLedger(): Prisma.ProfileReputationLedgerDelegate<ExtArgs, ClientOptions>;
}

export function getPrismaClientClass(dirname: string): PrismaClientConstructor {
  config.dirname = dirname
  return runtime.getPrismaClient(config) as unknown as PrismaClientConstructor
}
