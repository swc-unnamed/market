import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$extends({
	name: 'onAuctionListingCreate',
	query: {
		auctionListing: {
			async create({ args, query }) {
				const result = await query(args);
				// TODO: Trigger redis pub/sub event
				return result;
			}
		}
	}
});

export { prisma };
