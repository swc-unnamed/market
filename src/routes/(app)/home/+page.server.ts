import { db } from '$lib/server/db/index.js';

export const load = async ({ locals }) => {
	const records = await db.query.auctionListings.findMany({
		where: (r, { eq }) => eq(r.status, 'new'),
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

	return {
		records: records
	};
};
