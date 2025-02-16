import { HolochainArchitectPermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { systemSettingsSchema } from '$lib/models/zod/settings/system-settings.schema.js';
import { prisma } from '$lib/prisma.js';
import { db } from '$lib/server/db/index.js';
import { systemSettings } from '$lib/server/db/schema/system-settings.js';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	guard(locals, HolochainArchitectPermissionPolicy);

	const settingsRecord = await prisma.systemSetting.findFirst();

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
		guard(locals, HolochainArchitectPermissionPolicy);

		const form = await superValidate(request, zod(systemSettingsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const settingsRecord = await prisma.systemSetting.findFirst();

		await prisma.systemSetting.upsert({
			where: { id: settingsRecord?.id },
			create: {
				auctionWebhookUrl: form.data.auctionWebhookUrl
			},
			update: {
				auctionWebhookUrl: form.data.auctionWebhookUrl
			}
		});

		return { form };
	}
};
