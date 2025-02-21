import { prisma } from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

export const GET = async () => {
	const auction = await prisma.auction.findFirst({
		orderBy: {
			startAt: 'desc'
		}
	});

	return redirect(302, `/p/auctions/${auction?.id}`);
};
