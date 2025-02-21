import { requestIntegrationSchema } from '$lib/models/zod/integrations/request-integration.schema.js';
import { prisma } from '$lib/prisma.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	const data = await prisma.integration.findMany({
		where: {
			registeredById: locals.user.id
		}
	});

	const form = await superValidate(zod(requestIntegrationSchema));

	form.data.scopes = [];

	return {
		integrations: data,
		form: form
	};
};

export const actions = {
	requestIntegration: async ({ locals, request }) => {
		const form = await superValidate(request, zod(requestIntegrationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const integration = await prisma.integration.create({
			data: {
				name: form.data.name,
				description: form.data.description,
				registeredById: locals.user.id,
				scopes: form.data.scopes
			}
		});

		return { form };
	},

	revokeIntegration: async ({ url, locals }) => {
		const id = url.searchParams.get('id') as string;

		if (!id) {
			return fail(400, { message: 'Missing id' });
		}

		await prisma.integration.delete({
			where: {
				id: id,
				registeredById: locals.user.id
			}
		});
	}
};
