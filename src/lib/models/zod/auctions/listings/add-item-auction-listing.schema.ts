import { z } from 'zod';

export const addItemAuctionListingSchema = z.object({
	entityId: z.string().refine((v) => v, { message: 'Entity ID is required' }),
	combineId: z.string(),
	entityType: z.string().refine((v) => v, { message: 'Asset type is required' }),
	uuu: z.boolean().default(true),
	customItem: z.boolean().default(false),
	customItemName: z.string(),
	customImageUrl: z.string(),
	uniqueItem: z.boolean()
});
