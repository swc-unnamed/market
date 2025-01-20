import { db } from '$lib/server/db/index.js';
import { assets, entities } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load = async () => {
	const records = await db.query.entities.findMany({
		orderBy: asc(entities.name)
	});

	return {
		records: records
	};
};
