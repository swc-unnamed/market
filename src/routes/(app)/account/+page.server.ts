import { db } from '$lib/server/db/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const record = await db.query.users.findFirst({
		where: (r, { eq }) => eq(r.id, locals.user.id)
	});

	if (!record) {
		throw error(404, 'User not found');
	}

	return {
		record: record
	};
};
