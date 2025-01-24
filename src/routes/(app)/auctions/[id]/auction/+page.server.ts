import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { db } from '$lib/server/db';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: AuctioneerPermissionPolicy,
		redirectTo: '/auctions'
	});

	const record = await db.query.auctions.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			listings: {
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
