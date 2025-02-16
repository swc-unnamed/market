import { prisma } from '$lib/prisma.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	const isAnonymousListing = await prisma.auctionListing.findUnique({
		where: {
			id: params.id
		},
		select: {
			anonymousListing: true
		}
	});

	if (!isAnonymousListing) {
		return error(404, {
			message: 'Auction Listing Not Found'
		});
	}

	const listing = await prisma.auctionListing.findUnique({
		where: {
			id: params.id
		},
		include: {
			items: {
				include: {
					entity: true,
					asset: true
				}
			},
			listedBy: isAnonymousListing.anonymousListing
				? undefined
				: {
						select: {
							id: true,
							name: true,
							avatar: true
						}
					}
		}
	});

	if (!listing) {
		return error(404, {
			message: 'Auction Listing Not Found'
		});
	}

	return {
		listing: listing,
		isOwnListing: listing.listedById === locals.user.id
	};
};
