import { db } from '$lib/server/db/index.js';

export const load = async ({ locals, params }) => {
	const record = await db.query.assets.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
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
