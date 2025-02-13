import { guard } from '$lib/helpers/guard';
import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies';
import { db } from '$lib/server/db';
import { desc } from 'drizzle-orm';
import { auctions } from '$lib/server/db/schema/auctions.js';

export const load = async ({ locals }) => {
	guard(locals, AuctioneerPermissionPolicy);

	const records = await db.query.auctions.findMany({
		where: (r, { isNotNull }) => isNotNull(r.completedAt),
		with: {
			listings: {
				columns: {
					id: true,
					status: true
				}
			}
		},
		orderBy: desc(auctions.completedAt)
	});

	return {
		auctions: records
	};
};
