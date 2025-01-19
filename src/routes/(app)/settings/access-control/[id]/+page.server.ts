import { db } from '$lib/server/db';
import { verifyRole } from '$lib/server/utils/verify-role';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: ['magistrate', 'holochain_architect', 'market_tzar']
	});

	const record = await db.query.users.findFirst({
		where: (r, { eq }) => eq(r.id, params.id)
	});

	if (!record) {
		throw error(404, 'User not found');
	}

	return {
		record: record
	};
};
