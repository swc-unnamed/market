import { z } from 'zod';

export const newAuctionSchema = z.object({
	title: z.string().refine((v) => v, { message: 'Title is required' }),
	startAt: z.string().refine((v) => v, { message: 'Start time is required' }),
	listings: z.array(z.string()).min(1)
});
