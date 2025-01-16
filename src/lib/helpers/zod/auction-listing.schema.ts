import { z } from 'zod';

export const auctionListingSchema = z.object({
	id: z.string().nullable().optional(),
	listingNumber: z.number().nullable().optional(),
	listedBy: z.string(),
	startingPrice: z.string(),
	purchasedBy: z.string().nullable(),
	purchasedPrice: z.number().nullable(),
	title: z.string(),
	description: z.string(),
	location: z.string({ message: 'Location is required' }),
	sendCreditsTo: z.string({
		message: 'We need to know where to send the credits to. Could be a user or a faction.'
	}),
	listerIsAnon: z.boolean()
});

export type AuctionListingType = z.infer<typeof auctionListingSchema>;
