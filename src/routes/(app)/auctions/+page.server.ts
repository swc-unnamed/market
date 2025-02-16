import { prisma } from '$lib/prisma.js';
import { db } from '$lib/server/db/index.js';

export const load = async ({ locals }) => {
	const records = await prisma.auction.findMany({
		where: {
			closed: false
		},
		include: {
			listings: true
		}
	});

	return {
		records: records
	};
};
