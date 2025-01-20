import { banUserSchema, updateUserRoleSchema } from '$lib/models/zod/users/update-user.js';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/users.js';
import { verifyRole } from '$lib/server/utils/verify-role';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

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
			bannedReason: record.banned_reason
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

		const isRoleVerified = verifyRole({
			userRole: locals.user.role,
			allowedRoles: ['magistrate', 'holochain_architect', 'market_tzar'],
			noRedirect: true
		});

		if (!isRoleVerified) {
			return fail(403, {
				message: 'You do not have permission to perform this action.',
				roleUpdateForm: form
			});
		}

		if (!form.valid) {
			return fail(400, {
				roleUpdateForm: form,
				message: 'Please correct the errors in the form.'
			});
		}

		const record = await db.query.users.findFirst({
			where: (r, { eq }) => eq(r.id, form.data.id)
		});

		if (!record) {
			return fail(404, { message: 'User not found', form: form });
		}

		await db
			.update(users)
			.set({
				role: form.data.role
			})
			.where(eq(users.id, form.data.id));

		return {
			roleUpdateForm: form
		};
	},

	ban: async ({ locals, params, request }) => {
		const form = await superValidate(request, zod(banUserSchema));

		if (!form.valid) {
			return fail(400, { banForm: form, message: 'Please correct the errors in the form!' });
		}

		const isRoleVerified = verifyRole({
			userRole: locals.user.role,
			allowedRoles: ['magistrate', 'holochain_architect', 'market_tzar'],
			noRedirect: true
		});

		if (!isRoleVerified) {
			return fail(403, {
				message: 'You do not have permission to perform this action.',
				banForm: form
			});
		}

		const record = await db.query.users.findFirst({
			where: (r, { eq }) => eq(r.id, form.data.id)
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

		await db
			.update(users)
			.set({
				banned: form.data.banned,
				banned_reason: form.data.bannedReason
			})
			.where(eq(users.id, form.data.id));

		return {
			banForm: form
		};
	}
};
