import { db } from '$lib/database/db'
export const load = async () => {

	const records = await db.entity.findMany({
		orderBy: {
			name: 'asc'
		},
		include: {
			_count: {
				select: {
					ledgers: true
				}
			}
		}
	});

	return {
		entities: records
	}
}