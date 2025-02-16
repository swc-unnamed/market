import { z } from 'zod';
import { EntityType } from '@prisma/client';

export const addItemAuctionListingSchema = z.object({
	entityId: z.string().refine((v) => v, { message: 'Entity ID is required' }),
	combineId: z.string(),
	entityType: z.nativeEnum(EntityType).refine((v) => v, { message: 'Asset type is required' }),
	uuu: z.boolean().default(true),
	quantity: z.number().default(1),
	customItem: z.boolean().default(false),
	customItemName: z.string(),
	customImageUrl: z.string(),
	uniqueItem: z.boolean()
});
