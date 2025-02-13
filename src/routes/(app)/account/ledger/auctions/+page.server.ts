import { db } from '$lib/server/db/index.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { desc } from 'drizzle-orm';

export const load = async ({ locals, url }) => {
	const filter = (url.searchParams.get('filter') as unknown as string) || 'all';

	const auctions = await db.query.auctionListings.findMany({
		where: (r, { eq, inArray, and, or }) => {
			if (filter === 'all') {
				return and(
					or(eq(r.listedById, locals.user.id), eq(r.purchasedById, locals.user.id)),
					eq(r.isDeleted, false),
					inArray(r.status, ['new', 'selected', 'sold', 'completed'])
				);
			}

			if (filter === 'sold') {
				return and(
					eq(r.listedById, locals.user.id),
					eq(r.isDeleted, false),
					inArray(r.status, ['new', 'selected', 'sold', 'completed'])
				);
			}

			if (filter === 'purchased') {
				return and(
					eq(r.purchasedById, locals.user.id),
					eq(r.isDeleted, false),
					inArray(r.status, ['new', 'selected', 'sold', 'completed'])
				);
			}
		},
		orderBy: desc(auctionListings.listingNumber)
	});

	return {
		auctions: auctions
	};
};
