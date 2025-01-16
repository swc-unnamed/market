import { db } from '$lib/server/db/index.js';
import { assets } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load = async () => {
	const foundAssets = await db.query.assets.findMany({
		orderBy: asc(assets.name)
	});

	return {
		assets: foundAssets
	};
};
