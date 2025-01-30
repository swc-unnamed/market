import { db } from '$lib/server/db/index.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { desc } from 'drizzle-orm';

export const load = async ({ locals, depends }) => {
	const records = await db.query.auctionListings.findMany({
		where: (r, { and, eq }) =>
			and(eq(r.status, 'draft'), eq(r.listedById, locals.user.id), eq(r.isDeleted, false)),
		orderBy: desc(auctionListings.listingNumber),
		with: {
			items: true
		}
	});

	depends('draft_listings');

	return {
		records: records
	};
};
