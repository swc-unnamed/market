import { z } from 'zod';

export const modifyAuctionSchema = z.object({
	id: z.string(),
	title: z.string(),
	startAt: z.string(),
	listings: z.array(z.string())
});
