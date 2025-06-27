import { db } from '$lib/database/db.js'
import { guard } from '$lib/utils/guard.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	if (!guard(locals, ['Developer', 'Tzar'])) {
		return error(403, {
			message: 'You do not have permission to access this page.'
		})
	}

	const records = await db.user.findMany({
		orderBy: {
			username: 'asc',
		},
		select: {
			id: true,
			username: true,
			role: true,
			lastLogin: true,
			profile: {
				select: {
					displayName: true,
					reputation: true,
					avatar: true,
				}
			}
		}
	});

	return {
		users: records
	}
}