import { db } from '$lib/database/db.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const { id } = params;

	const record = await db.entity.findUnique({
		where: { id },
		include: {
			ledgers: true
		}
	});

	if (!record) {
		return error(404, 'Entity not found');
	}

	// convert the entity.combineData to an object
	let combineData: any | null = null;
	if (typeof record.combineData === 'string') {
		combineData = JSON.parse(record.combineData)
	} else if (record.combineData !== null && record.combineData !== undefined) {
		combineData = record.combineData
	}

	console.log(combineData)

	return {
		entity: record,
		combineData
	}
}