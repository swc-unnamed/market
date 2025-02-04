import { userHooksSchema } from '$lib/models/zod/users/user-hooks.schema.js';
import { db } from '$lib/server/db/index.js';
import { userWebhooks } from '$lib/server/db/schema/user-webhooks.js';
import { error } from '@sveltejs/kit';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, depends }) => {
	depends('account');
	const record = await db.query.users.findFirst({
		where: (r, { eq }) => eq(r.id, locals.user.id),
		with: {
			webhooks: true
		}
	});

	if (!record) {
		throw error(404, 'User not found');
	}

	return {
		record: record,
		form: await superValidate(zod(userHooksSchema))
	};
};

export const actions = {
	registerHook: async ({ locals, request }) => {
		const form = await superValidate(request, zod(userHooksSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log(form.data);

		if (!form.data.webhook.includes('discord')) {
			return fail(400, { form, message: 'Webhook must be a Discord URL' });
		}

		const hook = await db
			.insert(userWebhooks)
			.values({
				userId: locals.user.id,
				events: form.data.events,
				type: form.data.type,
				webhook: form.data.webhook,
				name: form.data.name
			})
			.returning({ ...getTableColumns(userWebhooks) });

		return { form, message: `Hook ${hook[0].id} registered` };
	},

	deleteHook: async ({ locals, request }) => {
		const formData = await request.formData();

		console.log(formData);

		const record = await db.query.userWebhooks.findFirst({
			where: (r, { eq, and }) =>
				and(eq(r.id, formData.get('id') as string), eq(r.userId, locals.user.id))
		});

		if (!record) {
			return fail(404, { message: 'Hook not found' });
		}

		await db
			.delete(userWebhooks)
			.where(and(eq(userWebhooks.id, record.id), eq(userWebhooks.userId, locals.user.id)));
	}
};
