import { z } from 'zod';

export const newAuctionListingItemSchema = z.object({
	entityId: z.string(),
	uuu: z.boolean().default(true),
	quantity: z.number().min(1).default(1),
	customImageUrl: z.string().nullable().optional(),
	asset: z.object({
		typeId: z.string().optional(),
		type: z.string(),
		combineId: z.number().nullable()
	})
});
