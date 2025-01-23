import { db } from '$lib/server/db/index.js';
import { error, fail } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	const listing = await db.query.auctionListings.findFirst({
		where: (l, { and, eq }) => and(eq(l.id, params.id)),
		with: {
			items: {
				with: {
					entity: true,
					asset: true
				}
			},
			listedBy: {
				columns: {
					name: true,
					avatar: true
				}
			},
			history: true
		}
	});

	if (!listing) {
		return error(404, {
			message: 'Auction Listing Not Found'
		});
	}

	return {
		listing: listing
	};
};
