import { db } from '$lib/server/db/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	const record = await db.query.auctions.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			listings: {
				columns: {
					id: true,
					title: true,
					startingPrice: true,
					location: true,
					listerIsAnon: true
				},
				with: {
					items: {
						columns: {
							entityId: true
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
			}
		}
	});

	if (!record) {
		throw error(404, {
			message: 'Auction was not found in the holochain.'
		});
	}

	// If the lister is anonymous, we don't want to show their details.
	record.listings.forEach((listing) => {
		if (listing.listerIsAnon) {
			listing.listedBy = null;
		}
	});

	return {
		record: record
	};
};
