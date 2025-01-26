import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { db } from '$lib/server/db';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { auctions } from '$lib/server/db/schema/auctions.js';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { error } from '@sveltejs/kit';
import { asc } from 'drizzle-orm';

export const load = async ({ locals, params, depends }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: AuctioneerPermissionPolicy,
		redirectTo: '/auctions'
	});

	depends('auction:live');

	const record = await db.query.auctions.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			listings: {
				orderBy: asc(auctionListings.listingNumber),
				with: {
					items: {
						with: {
							asset: true,
							entity: true
						}
					},
					listedBy: {
						columns: {
							id: true,
							name: true,
							avatar: true
						}
					},
					purchasedBy: {
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

	const users = await db.query.users.findMany({
		where: (r, { eq }) => eq(r.banned, false),
		columns: {
			id: true,
			name: true
		}
	});

	return {
		record: record,
		users: users
	};
};

export const actions = {
	end: async ({ params, locals }) => {
		const canEndAuction = verifyRole({
			userRole: locals.user.role,
			allowedRoles: AuctioneerPermissionPolicy,
			noRedirect: true
		});

		if (!canEndAuction) {
			return error(403, {
				message: 'You do not have permission to end an auction.'
			});
		}

		await db.update(auctions).set({
			completedAt: new Date()
		});

		return {
			message: 'Auction has been ended.'
		};
	}
};
