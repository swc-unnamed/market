import { userHooksSchema } from '$lib/models/zod/users/user-hooks.schema.js';
import { prisma } from '$lib/prisma.js';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { CombineScopeMap } from '$lib/models/combine/combine-scopes.js';
import { SwcClient } from 'swcombine.js';

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

	const userScopes: CombineScopeMap = {
		character_read: user.scopes.includes('character_read'),
		personal_inv_overview: user.scopes.includes('personal_inv_overview'),
		personal_inv_creatures_read: user.scopes.includes('personal_inv_creatures_read'),
		personal_inv_droids_read: user.scopes.includes('personal_inv_droids_read'),
		personal_inv_facilities_read: user.scopes.includes('personal_inv_facilities_read'),
		personal_inv_items_read: user.scopes.includes('personal_inv_items_read'),
		personal_inv_materials_read: user.scopes.includes('personal_inv_materials_read'),
		personal_inv_npcs_read: user.scopes.includes('personal_inv_npcs_read'),
		personal_inv_ships_read: user.scopes.includes('personal_inv_ships_read'),
		personal_inv_stations_read: user.scopes.includes('personal_inv_stations_read'),
		personal_inv_vehicles_read: user.scopes.includes('personal_inv_vehicles_read'),
		faction_inv_overview: user.scopes.includes('faction_inv_overview'),
		faction_inv_creatures_read: user.scopes.includes('faction_inv_creatures_read'),
		faction_inv_droids_read: user.scopes.includes('faction_inv_droids_read'),
		faction_inv_facilities_read: user.scopes.includes('faction_inv_facilities_read'),
		faction_inv_items_read: user.scopes.includes('faction_inv_items_read'),
		faction_inv_materials_read: user.scopes.includes('faction_inv_materials_read'),
		faction_inv_npcs_read: user.scopes.includes('faction_inv_npcs_read'),
		faction_inv_ships_read: user.scopes.includes('faction_inv_ships_read'),
		faction_inv_stations_read: user.scopes.includes('faction_inv_stations_read'),
		faction_inv_vehicles_read: user.scopes.includes('faction_inv_vehicles_read')
	};

	console.log(userScopes);

	const combineScopeResponse = (await SwcClient.public().api.getPermissions()).map((scope) => {
		if (scope.name in userScopes) {
			return { scope, allowed: userScopes[scope.name as keyof CombineScopeMap] };
		}
	});

	console.log(combineScopeResponse);

	return {
		record: user,
		form: await superValidate(zod(userHooksSchema)),
		scopes: combineScopeResponse
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
