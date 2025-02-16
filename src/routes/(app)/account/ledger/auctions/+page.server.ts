import { prisma } from '$lib/prisma.js';
import type { AuctionListingStatus } from '@prisma/client';

export const load = async ({ locals, url }) => {
	const filter = (url.searchParams.get('filter') as unknown as AuctionListingStatus) || null;

	const auctions = await prisma.auctionListing.findMany({
		where: {
			...(filter ? { status: filter } : {}),
			...{
				OR: [{ listedById: locals.user.id }, { winningBidderId: locals.user.id }]
			}
		},
		orderBy: {
			listingNumber: 'desc'
		}
	});

	return {
		auctions: auctions
	};
};
