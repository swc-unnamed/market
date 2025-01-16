import { z } from 'zod';

export const auctionListingItemSchema = z.object({
	listingId: z.string().nullable().optional(),
	assetId: z.string().nullable(),
	u3: z.boolean().default(true),
	quantity: z.number().default(1),
	customImageUrl: z.string().nullable().optional()
});

export type AuctionListingItemType = z.infer<typeof auctionListingItemSchema>;
