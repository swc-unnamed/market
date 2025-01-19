import { db } from '$lib/server/db/index.js';

export const load = async ({ locals }) => {
	const userListings = await db.query.auctionListings.findMany({
		where: (r, { eq }) => eq(r.listedById, locals.user.id),
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
		userListings: userListings
	};
};
