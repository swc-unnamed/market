import { error } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.js';

export const load = async ({ params }) => {
	const record = await prisma.auction.findFirst({
		where: { id: params.id },
		include: {
			listings: {
				select: {
					description: true,
					location: true,
					startingBid: true,
					title: true,
					listingNumber: true,
					id: true,
					status: true
				},
				include: {
					items: {
						include: {
							asset: true,
							entity: true
						}
					}
				}
			}
		}
	});

	if (!record) {
		throw error(404, 'Auction not found');
	}
	return {
		record: record
	};
};
