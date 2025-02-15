import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { prisma } from '$lib/prisma.js';

export const load = async ({ locals, url }) => {
	guard(locals, AuctioneerPermissionPolicy);
	const MAX_PAGE_SIZE = 50;
	const page = parseInt(url.searchParams.get('page') as string) || 1;

	const records = await prisma.auction.findMany({
		orderBy: {
			closedAt: 'desc'
		},
		skip: (page - 1) * MAX_PAGE_SIZE,
		take: MAX_PAGE_SIZE,
		include: {
			listings: {
				select: {
					id: true,
					status: true
				}
			}
		}
	});

	return {
		data: {
			meta: {
				page: page,
				pageSize: MAX_PAGE_SIZE,
				total: await prisma.auction.count()
			},
			auctions: records
		}
	};
};
