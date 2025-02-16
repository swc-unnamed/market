import { userHooksSchema } from '$lib/models/zod/users/user-hooks.schema.js';
import { prisma } from '$lib/prisma.js';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, depends }) => {
	depends('account');

	const record = await prisma.user.findFirst({
		where: {
			id: locals.user.id
		},
		include: {
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

		const hook = await prisma.userWebhook.create({
			data: {
				userId: locals.user.id,
				type: form.data.type,
				name: form.data.name,
				webhook: form.data.webhook
			}
		});

		return { form, message: `Hook ${hook.id} registered` };
	},

	deleteHook: async ({ locals, request }) => {
		const formData = await request.formData();

		const record = await prisma.userWebhook.findUnique({
			where: { id: formData.get('id') as string }
		});

		if (!record) {
			return fail(404, { message: 'Hook not found' });
		}

		await prisma.userWebhook.delete({
			where: {
				id: record.id,
				userId: locals.user.id
			}
		});
	}
};
