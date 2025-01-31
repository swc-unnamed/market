import { HolochainArchitectPermissionPolicy } from '$lib/consts/permission-policies.js';
import { systemSettingsSchema } from '$lib/models/zod/settings/system-settings.schema.js';
import { db } from '$lib/server/db/index.js';
import { systemSettings } from '$lib/server/db/schema/system-settings.js';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: HolochainArchitectPermissionPolicy,
		redirectTo: '/home'
	});

	const settingsRecord = await db.query.systemSettings.findFirst();

	const form = await superValidate(zod(systemSettingsSchema), {
		defaults: {
			...settingsRecord
		}
	});

	return {
		form: form
	};
};

export const actions = {
	update: async ({ locals, request }) => {
		const isVerified = verifyRole({
			userRole: locals.user.role,
			allowedRoles: HolochainArchitectPermissionPolicy,
			noRedirect: true
		});

		if (!isVerified) {
			return error(403, 'Forbidden');
		}

		const form = await superValidate(request, zod(systemSettingsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const settingsRecord = await db.query.systemSettings.findFirst();

		if (settingsRecord) {
			await db
				.update(systemSettings)
				.set({
					auctionWebhookUrl: form.data.auctionWebhookUrl
				})
				.where(eq(systemSettings.id, settingsRecord.id));
		} else {
			await db.insert(systemSettings).values({
				auctionWebhookUrl: form.data.auctionWebhookUrl
			});
		}
	}
};
