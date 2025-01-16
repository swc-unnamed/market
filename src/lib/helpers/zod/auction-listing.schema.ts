import { z } from 'zod';
import { auctionListingItemSchema } from './auction-listing-item.schema';

export const auctionListingSchema = z.object({
	id: z.string().nullable().optional(),
	listingNumber: z.number().nullable().optional(),
	listedBy: z.string(),
	startingPrice: z.string().min(1, { message: 'Starting price is required' }),
	purchasedBy: z.string().nullable(),
	purchasedPrice: z.number().nullable(),
	title: z.string().min(3, { message: 'Give your listing a little longer title.' }),
	description: z.string().min(3, { message: 'Description is required' }),
	location: z.string().min(3, { message: 'Location is required' }),
	sendCreditsTo: z.string().min(3, {
		message: 'We need to know where to send the credits to. Could be a user or a faction.'
	}),
	listerIsAnon: z.boolean()
});

export type AuctionListingType = z.infer<typeof auctionListingSchema>;

export const newAuctionListingSchema = z.object({
	...auctionListingSchema.shape,
	items: z.array(z.object({ ...auctionListingItemSchema.shape })).min(1)
});
