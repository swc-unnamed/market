import { z } from 'zod';

export const modifyAuctionListingSchema = z.object({
	title: z.string().min(4).max(255, { message: 'Title must be between 4 and 255 characters' }),
	details: z.string().nullable(),
	location: z.string().optional(),
	startingBid: z.string().optional(),
	anonymousListing: z.boolean(),
	sendCreditsTo: z.string()
});
