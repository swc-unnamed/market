import { db } from '$lib/server/db/index.js';

export const load = async () => {
	const assets = await db.query.assets.findMany({});

	return {
		assets: assets
	};
};
