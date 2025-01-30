import { db } from '$lib/server/db/index.js';
import { error, fail } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	const listing = await db.query.auctionListings.findFirst({
		where: (l, { and, eq }) => and(eq(l.id, params.id), eq(l.isDeleted, false)),
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

	if (listing.listedById !== locals.user.id) {
		if (listing.listerIsAnon) {
			listing.listedBy = null;
		}
	}

	return {
		listing: listing,
		isOwnListing: listing.listedById === locals.user.id
	};
};
