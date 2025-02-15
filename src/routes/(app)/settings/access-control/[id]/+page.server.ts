import { MagistratePermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { banUserSchema, updateUserRoleSchema } from '$lib/models/zod/users/update-user.js';
import { prisma } from '$lib/prisma.js';
import { error } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, params }) => {
	guard(locals, MagistratePermissionPolicy);

	const record = await prisma.user.findFirst({
		where: { id: params.id }
	});

	if (!record) {
		throw error(404, 'User not found');
	}

	const roleUpdateForm = await superValidate(zod(updateUserRoleSchema), {
		defaults: {
			id: record.id,
			role: record.role
		}
	});

	const banForm = await superValidate(zod(banUserSchema), {
		defaults: {
			id: record.id,
			banned: record.banned,
			bannedReason: record.bannedReason
		}
	});

	return {
		record: record,
		roleUpdateForm: roleUpdateForm,
		banForm: banForm
	};
};

export const actions = {
	updateRole: async ({ locals, request }) => {
		const form = await superValidate(request, zod(updateUserRoleSchema));
		guard(locals, MagistratePermissionPolicy);

		if (!form.valid) {
			return fail(400, {
				roleUpdateForm: form,
				message: 'Please correct the errors in the form.'
			});
		}

		const record = await prisma.user.findFirst({
			where: { id: form.data.id }
		});

		if (!record) {
			return fail(404, { message: 'User not found', form: form });
		}

		await prisma.user.update({
			where: {
				id: form.data.id
			},
			data: {
				role: form.data.role
			}
		});

		return {
			roleUpdateForm: form
		};
	},

	ban: async ({ locals, params, request }) => {
		guard(locals, MagistratePermissionPolicy);
		const form = await superValidate(request, zod(banUserSchema));

		if (!form.valid) {
			return fail(400, { banForm: form, message: 'Please correct the errors in the form!' });
		}

		const record = await prisma.user.findFirst({
			where: { id: form.data.id }
		});

		if (!record) {
			return fail(404, { message: 'User not found', banForm: form });
		}

		if (form.data.banned) {
			if (!form.data.bannedReason) {
				return fail(400, {
					banForm: form,
					message: 'Please provide a reason for banning the user'
				});
			}
		}

		await prisma.user.update({
			where: {
				id: form.data.id
			},
			data: {
				banned: form.data.banned,
				bannedReason: form.data.bannedReason
			}
		});

		return {
			banForm: form
		};
	}
};
