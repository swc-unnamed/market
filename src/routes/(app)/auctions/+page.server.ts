import { db } from '$lib/server/db/index.js';

export const load = async ({ locals }) => {
	const records = await db.query.auctions.findMany({
		where: (r, { eq, isNull }) => isNull(r.completedAt),
		with: {
			listings: true
		}
	});

	return {
		records: records
	};
};
