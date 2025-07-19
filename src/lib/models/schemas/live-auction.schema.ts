import { z } from 'zod';

export const liveAuctionSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	startTime: z.string().min(1, 'Start time is required'),
	moderatorId: z.string().min(1, 'Moderator is required'),
	listings: z.array(z.string()).min(1, 'At least one listing is required')
});

export type LiveAuctionSchema = z.infer<typeof liveAuctionSchema>;