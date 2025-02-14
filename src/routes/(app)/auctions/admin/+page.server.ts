import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { db } from '$lib/server/db/index.js';
import { auctions } from '$lib/server/db/schema/auctions.js';
import { desc } from 'drizzle-orm';

export const load = async ({ locals }) => {
	guard(locals, AuctioneerPermissionPolicy);

	const records = await db.query.auctions.findMany({
		limit: 10,
		orderBy: desc(auctions.completedAt),
		with: {
			listings: {
				columns: {
					id: true,
					status: true
				}
			}
		}
	});

	return {
		auctions: records
	};
};
