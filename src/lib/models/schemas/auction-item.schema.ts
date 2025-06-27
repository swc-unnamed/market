import { z } from "zod";

export const auctionItemSchema = z.object({
	name: z.string(),
	entityId: z.string(),
	quantity: z.number(),
	uuu: z.boolean().default(true),
	unique: z.boolean().default(false),
	customName: z.string().optional(),
	customImage: z.string().optional()
});

export type AuctionItem = typeof auctionItemSchema;

export const auctionListingUpdateSchema = z.object({
	title: z.string(),
	description: z.string(),
	location: z.string(),
	minimumBid: z.string().default('100,000'),
	anonymous: z.boolean().default(false),
	creditsRecipient: z.string()
});

export type AuctionListingUpdate = typeof auctionListingUpdateSchema;