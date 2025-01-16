import { db } from '$lib/server/db/index.js';

export const load = async ({ locals }) => {
	const userListings = await db.query.auctionListings.findMany({
		where: (r, { eq }) => eq(r.listedBy, locals.user.id)
	});

	return {
		userListings: userListings
	};
};
