import { z } from 'zod';
import { newAuctionListingItemSchema } from './auction-listing-item.schema';

export type AuctionListingType = z.infer<typeof newAuctionListingSchema>;

export const newAuctionListingSchema = z.object({
	listedById: z.string(),
	startingPrice: z.string().min(1, { message: 'Starting price is required' }),
	title: z.string().min(3, { message: 'Give your listing a little longer title.' }),
	description: z.string().min(3, { message: 'Description is required' }),
	location: z.string().min(3, { message: 'Location is required' }),
	sendCreditsTo: z.string().min(3, {
		message: 'We need to know where to send the credits to. Could be a user or a faction.'
	}),
	listerIsAnon: z.boolean(),
	items: z.array(z.object({ ...newAuctionListingItemSchema.shape })).min(1)
});
