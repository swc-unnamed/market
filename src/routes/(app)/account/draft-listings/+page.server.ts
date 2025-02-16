import { prisma } from '$lib/prisma.js';

export const load = async ({ locals, depends }) => {
	const records = await prisma.auctionListing.findMany({
		where: {
			AND: [
				{
					listedById: locals.user.id
				},
				{
					status: 'draft'
				}
			]
		},
		orderBy: {
			listingNumber: 'desc'
		},
		include: {
			items: true
		}
	});

	depends('draft_listings');

	return {
		records: records
	};
};
