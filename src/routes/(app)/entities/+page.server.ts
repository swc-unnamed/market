import { prisma } from '$lib/prisma';

export const load = async () => {
	const records = await prisma.entity.findMany({
		orderBy: {
			name: 'asc'
		}
	});

	return {
		records: records
	};
};
