import { prisma } from '$lib/prisma.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	const record = await prisma.auction.findUnique({
		where: { id: params.id },
		include: {
			listings: {
				orderBy: {
					listingNumber: 'asc'
				},
				include: {
					items: {
						include: {
							asset: true,
							entity: true
						}
					},
					listedBy: {
						select: {
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

	// If the lister is anonymous, we don't want to show their details.
	record.listings.forEach((listing) => {
		if (listing.anonymousListing) {
			listing.listedBy = {
				id: 'anonymous',
				name: 'Anonymous',
				avatar: null
			};
		}
	});

	return {
		record: record
	};
};
