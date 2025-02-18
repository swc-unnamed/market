import { userHooksSchema } from '$lib/models/zod/users/user-hooks.schema.js';
import { prisma } from '$lib/prisma.js';
import { error, redirect } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { CombineScopeMap } from '$lib/models/combine/combine-scopes.js';
import { SwcClient } from 'swcombine.js';
import { CombineScopeCheck } from '$lib/helpers/combine-scope-check.js';
import { updateUserScopesSchema } from '$lib/models/zod/users/update-user-scopes.schema.js';
import { env } from '$env/dynamic/private';

export const load = async ({ locals, depends }) => {
	depends('account');

	const user = await prisma.user.findFirst({
		where: {
			id: locals.user.id
		},
		include: {
			webhooks: true
		}
	});

	if (!user) {
		throw error(404, 'User not found');
	}

	const uScopes = new CombineScopeCheck(user.scopes);
	const userScopes = uScopes.getScopes();
	let combineScopeResponse = (await SwcClient.public().api.getPermissions()).map((scope) => {
		if (scope.name in userScopes) {
			return { scope, allowed: userScopes[scope.name as keyof CombineScopeMap] };
		}
	});
	combineScopeResponse = combineScopeResponse.filter((scope) => scope !== undefined);

	const userScopeForm = await superValidate(zod(updateUserScopesSchema), {
		defaults: {
			id: locals.user.id,
			scopes: user.scopes
		}
	});

	return {
		record: user,
		webhookForm: await superValidate(zod(userHooksSchema)),
		scopes: combineScopeResponse,
		userScopeForm: userScopeForm
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
	},

	updateCombineScopes: async ({ locals, request }) => {
		const form = await superValidate(request, zod(updateUserScopesSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const scopes = form.data.scopes;

		const params = new URLSearchParams();
		params.append('client_id', env.COMBINE_CLIENT_ID);
		params.append('response_type', 'code');
		params.append('redirect_uri', `${env.UIM_BASE_URL}/callback`);
		params.append('scope', scopes.join(' '));
		params.append('access_type', 'offline');
		params.append('renew_previously_granted', 'yes');
		params.append('state', 'profile');

		const url = `https://www.swcombine.com/ws/oauth2/auth/?${params.toString()}`;

		return redirect(303, url);
	}
};
