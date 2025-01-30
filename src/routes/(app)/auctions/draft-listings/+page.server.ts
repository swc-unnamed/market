import { db } from '$lib/server/db/index.js';

export const load = async ({ locals }) => {
	const records = await db.query.auctionListings.findMany({
		where: (r, { and, eq }) =>
			and(eq(r.status, 'draft'), eq(r.listedById, locals.user.id), eq(r.isDeleted, false)),
		with: {
			items: true
		}
	});

	return {
		records: records
	};
};
