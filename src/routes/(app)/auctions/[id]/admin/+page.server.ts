import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies';
import { guard } from '$lib/helpers/guard.js';
import { prisma } from '$lib/prisma.js';

export const load = async ({ locals, params, depends }) => {
	guard(locals, AuctioneerPermissionPolicy);

	depends('auction_admin');

	const record = await prisma.auction.findUnique({
		where: { id: params.id },
		include: {
			listings: {
				include: {
					items: {
						include: {
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

		const id = data.get('id') as string;

		await prisma.auctionListing.update({
			where: { id: id },
			data: {
				completedAt: new Date(),
				status: 'completed'
			}
		});

		return {
			success: true
		};
	}
};
