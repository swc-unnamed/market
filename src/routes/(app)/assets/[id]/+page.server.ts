import { prisma } from '$lib/prisma.js';

export const load = async ({ locals, params }) => {
	const record = await prisma.asset.findFirst({
		where: { id: params.id },
		include: {
			ledger: true,
			entity: true
		}
	});

	if (!record) {
		return {
			status: 404,
			error: new Error(`Not found`)
		};
	}

	return {
		record: record
	};
};
