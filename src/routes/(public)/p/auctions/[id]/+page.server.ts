import { db } from '$lib/server/db/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const record = await db.query.auctions.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			listings: {
				columns: {
					description: true,
					location: true,
					startingPrice: true,
					title: true,
					listingNumber: true,
					id: true,
					status: true
				},
				with: {
					items: {
						with: {
							asset: true,
							entity: true
						}
					}
				}
			}
		}
	});

	if (!record) {
		return error(404, 'Auction not found');
	}
	return {
		record: record
	};
};
