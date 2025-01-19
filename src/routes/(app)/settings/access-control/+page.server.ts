import { verifyRole } from '$lib/server/utils/verify-role.js';
import { db } from '$lib/server/db';
import { asc, count, desc, ilike } from 'drizzle-orm';
import { users } from '$lib/server/db/schema/users.js';
import type { PaginatedMeta } from '$lib/models/general/paginated-meta.js';

const MAX_PAGE_SIZE = 50;

export const load = async ({ locals, url }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: ['Magistrate', 'Holochain Architect', 'Market Tzar']
	});

	const searchTerm = url.searchParams.get('q') || '';
	const page = parseInt(url.searchParams.get('page') || '1');

	const recordCount = await db
		.select({ count: count() })
		.from(users)
		.where(ilike(users.name, `%${searchTerm}%`));
	const totalPages = Math.ceil(recordCount[0].count / MAX_PAGE_SIZE);

	const records = await db.query.users.findMany({
		where: (r, { ilike }) => {
			if (searchTerm) {
				return ilike(r.name, `%${searchTerm}%`);
			} else {
				undefined;
			}
		},
		offset: (page - 1) * MAX_PAGE_SIZE,
		limit: MAX_PAGE_SIZE,
		orderBy: asc(users.name)
	});

	const paginationMeta: PaginatedMeta = {
		page: page,
		pageSize: records.length,
		totalPages: totalPages,
		maxPerPage: MAX_PAGE_SIZE
	};

	return {
		meta: paginationMeta,
		records: records
	};
};
