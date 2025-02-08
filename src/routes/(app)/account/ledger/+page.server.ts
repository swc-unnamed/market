import { db } from '$lib/server/db/index.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { count, desc, eq } from 'drizzle-orm';

const PAGE_SIZE = 50;

export const load = async ({ locals, url }) => {
	const alpage = (url.searchParams.get('alpage') as unknown as number) || 1;

	console.log(alpage);

	const recordCount = await db
		.select({ createdAt: auctionListings.createdAt })
		.from(auctionListings)
		.orderBy(desc(auctionListings.createdAt))
		.groupBy(auctionListings.createdAt)
		.where(eq(auctionListings.listedById, locals.user.id));

	const alRecords = await db.query.auctionListings.findMany({
		where: (r, { eq }) => eq(r.listedById, locals.user.id),
		orderBy: desc(auctionListings.createdAt),
		offset: (alpage - 1) * PAGE_SIZE,
		limit: PAGE_SIZE,
		with: {
			auction: true,
			history: true,
			purchasedBy: {
				columns: {
					id: true,
					avatar: true,
					name: true
				}
			},
			items: {
				with: {
					asset: true,
					entity: true
				}
			}
		}
	});

	return {
		auctionListings: {
			meta: {
				page: alpage,
				pages: Math.ceil(recordCount.length / PAGE_SIZE),
				total: recordCount.length,
				pageSize: PAGE_SIZE,
				pageCount: alRecords.length
			},
			data: alRecords
		}
	};
};
