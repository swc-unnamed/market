import { db } from '$lib/server/db/index.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { asc } from 'drizzle-orm';

export const load = async ({ locals }) => {
	const records = await db.query.auctionListings.findMany({
		where: (r, { inArray, and, eq }) =>
			and(inArray(r.status, ['new', 'selected']), eq(r.isDeleted, false)),
		orderBy: asc(auctionListings.listingNumber),
		with: {
			items: {
				with: {
					asset: true
				}
			},
			listedBy: {
				columns: {
					id: true,
					name: true,
					avatar: true
				}
			}
		}
	});

	const assetLedger = await db.query.assetLedger.findMany({
		where: (r, { between }) =>
			between(r.time, new Date(Date.now() - 72 * 60 * 60 * 1000), new Date())
	});

	return {
		records: records,
		assetLedger: assetLedger
	};
};
