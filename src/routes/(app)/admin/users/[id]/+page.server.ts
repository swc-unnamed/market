import { db } from '$lib/database/db.js';
import { guard } from '$lib/utils/guard.js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { adminUserUpdateSchema } from './components/form.schema';
import { zod } from 'sveltekit-superforms/adapters';
import { GlobalAdminAccessPolicy } from '$lib/utils/access-policies';

export const load = async ({ locals, params }) => {
	const { id } = params;

	if (!guard(locals, ['Developer', 'Tzar'])) {
		return error(403, {
			message: 'You do not have permission to access this page.'
		})
	}

	const record = await db.user.findUnique({
		where: { id },
		include: {
			profile: true,
		}
	});

	if (!record) {
		return error(404, {
			message: 'User not found.'
		})
	}

	const updateForm = await superValidate(zod(adminUserUpdateSchema));

	updateForm.data = {
		id: record.id,
		role: record.role,
		displayName: record.profile?.displayName || '',
		banned: record.banned || false,
		bannedReason: record.bannedReason || '',
	}

	return {
		record: record,
		updateForm: updateForm,
	}
}

export const actions = {
	updateUser: async ({ request, locals }) => {
		if (!guard(locals, GlobalAdminAccessPolicy)) {
			return error(403, {
				message: 'You do not have permission to perform this action.'
			});
		}

		const form = await superValidate(request, zod(adminUserUpdateSchema));

		if (!form.valid) {
			return { form };
		}

		const { id, displayName, role, banned, bannedReason } = form.data;

		try {
			await db.user.update({
				where: { id: id },
				data: {
					role: role,
					banned: banned,
					bannedReason: bannedReason,
					profile: {
						update: {
							displayName: displayName
						}
					}
				}
			});

		} catch (error) {
			console.error(error);
			return { form };
		}

		return { form };
	}
};