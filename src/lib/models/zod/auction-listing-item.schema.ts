import { z } from 'zod';

export const newAuctionListingItemSchema = z.object({
	entityId: z.string().min(1, { message: 'Entity Selection is required' }),
	uuu: z.boolean().default(true),
	quantity: z.number().min(1).default(1),
	customImageUrl: z.string().nullable().optional(),
	asset: z.object({
		typeId: z.string().optional(),
		type: z.string(),
		combineId: z
			.number()
			.min(1, { message: 'Combine ID is required. Check your inventory to get the ID.' })
			.nullable()
	})
});
