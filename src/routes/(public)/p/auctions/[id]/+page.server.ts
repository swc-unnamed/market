import { db } from '$lib/server/db/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const record = await db.query.auctions.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			listings: {
				columns: {
					id: true,
					title: true,
					startingPrice: true,
					location: true,
					listerIsAnon: true,
					description: true
				},
				with: {
					items: {
						columns: {
							entityId: true,
							uuu: true,
							customImageUrl: true
						},
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
