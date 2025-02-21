import type { PaginatedMeta } from '$lib/models/general/paginated-meta.js';
import { MagistratePermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { prisma } from '$lib/prisma.js';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

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

	const betaAccess: { id: string; name: string; uid: string; createdAt: Date }[] = [];

	if (env.NODE_ENV !== 'production') {
		const betaUsers = await prisma.betaAccess.findMany({
			orderBy: {
				name: 'asc'
			}
		});
		betaAccess.push(...betaUsers);
	}

	return {
		meta: paginationMeta,
		records: users,
		betaAccess: betaAccess,
		environment: env.NODE_ENV
	};
};

export const actions = {
	addBetaUser: async ({ locals, request, fetch }) => {
		guard(locals, MagistratePermissionPolicy);

		const data = await request.formData();
		const name = data.get('name') as string;

		const handleCheckResponse = await fetch(`/api/combine/handlecheck?handle=${name}`, {
			headers: { Accept: 'application/json' }
		});

		if (handleCheckResponse.status === 404) {
			return error(404, { message: 'User not found.' });
		}

		const handleCheck = (await handleCheckResponse.json()) as { handle: string; uid: string };
		if (handleCheck.handle.localeCompare(name, undefined, { sensitivity: 'base' }) !== 0) {
			return error(400, { message: 'User not found.' });
		}

		const accessAccount = await prisma.betaAccess.create({
			data: {
				name: name,
				uid: handleCheck.uid
			}
		});

		console.log(accessAccount);

		return {
			status: 201
		};
	},

	deleteBetaUser: async ({ locals, request, url }) => {
		guard(locals, MagistratePermissionPolicy);

		const id = url.searchParams.get('id') as string;

		console.log(id);

		try {
			await prisma.betaAccess.delete({
				where: {
					id: id
				}
			});
		} catch (e) {
			console.log(e);
		}
	}
};
