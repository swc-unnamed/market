import { z } from 'zod';

export const publishListingSchema = z.object({
	title: z
		.string()
		.min(4, { message: 'Title must be between 4 and 50 characters.' })
		.max(50, { message: 'Title must be between 4 and 50 characters' }),
	description: z.string().optional().nullable(),
	location: z.string().max(400, { message: 'Location must be less than 400 characters' }),
	startingPrice: z.number().int().min(1, { message: 'Starting price must be at least 1 credit' }),
	sendCreditsTo: z.string(),
	listerIsAnon: z.boolean().optional().nullable()
});
