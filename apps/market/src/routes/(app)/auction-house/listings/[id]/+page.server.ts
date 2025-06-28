import { db } from '$lib/database/db.js';
import { GlobalAdminAccessPolicy } from '$lib/utils/access-policies.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const { id } = params;

	if (!id) {
		return error(404, {
			message: 'Listing not found'
		});
	}

	const record = await db.auctionListing.findUnique({
		where: { id: id },
		include: {
			creator: {
				select: {
					id: true,
					username: true,
					profile: true
				}
			},
			items: {
				include: {
					entity: {
						select: {
							id: true,
							name: true,
							type: true,
							imageSmall: true,
							imageLarge: true
						}
					}
				}
			}
		}
	});

	if (!record) {
		return error(404, {
			message: 'Listing not found'
		});
	}

	if (record.status === 'Draft') {
		let authorized = false;
		if (record.creatorId == locals.user.id) {
			authorized = false;
		}

		if (GlobalAdminAccessPolicy.includes(locals.user.role)) {
			authorized = true;
		}

		if (!authorized) {
			return error(403, {
				message: 'You do not have permission to view this listing.'
			});
		}
	}

	return {
		listing: record
	}
}