import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies';
import { guard } from '$lib/helpers/guard.js';
import { db } from '$lib/server/db/index.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, params, depends }) => {
	guard(locals, AuctioneerPermissionPolicy);

	depends('auction_admin');
	const record = await db.query.auctions.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			listings: {
				with: {
					items: {
						with: {
							entity: true
						}
					}
				}
			}
		}
	});

	return {
		auction: record
	};
};

export const actions = {
	complete: async ({ request, locals }) => {
		guard(locals, AuctioneerPermissionPolicy);

		const data = await request.formData();

		console.log(data.get('id'));

		const id = data.get('id') as string;

		await db
			.update(auctionListings)
			.set({
				status: 'completed'
			})
			.where(eq(auctionListings.id, id));

		return {
			success: true
		};
	}
};
