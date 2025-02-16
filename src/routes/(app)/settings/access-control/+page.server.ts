import type { PaginatedMeta } from '$lib/models/general/paginated-meta.js';
import { MagistratePermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { prisma } from '$lib/prisma.js';

const MAX_PAGE_SIZE = 50;

export const load = async ({ locals, url }) => {
	guard(locals, MagistratePermissionPolicy);

	const searchTerm = url.searchParams.get('q') || '';
	const page = parseInt(url.searchParams.get('page') || '1');

	const count = await prisma.user.count();

	const totalPages = Math.ceil(count / MAX_PAGE_SIZE);

	const users = await prisma.user.findMany({
		where: {
			name: {
				contains: searchTerm
			}
		},
		skip: (page - 1) * MAX_PAGE_SIZE,
		take: MAX_PAGE_SIZE,
		orderBy: {
			name: 'asc'
		}
	});

	const paginationMeta: PaginatedMeta = {
		page: page,
		pageSize: users.length,
		totalPages: totalPages,
		maxPerPage: MAX_PAGE_SIZE
	};

	return {
		meta: paginationMeta,
		records: users
	};
};
