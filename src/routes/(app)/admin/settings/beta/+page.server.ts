import { db } from '$lib/database/db.js';
import { GlobalAdminAccessPolicy } from '$lib/utils/access-policies';
import { guard } from '$lib/utils/guard';
import { error, fail } from '@sveltejs/kit';

export const load = async ({ locals, depends }) => {
	depends('admin:settings:beta-users');

	if (!guard(locals, GlobalAdminAccessPolicy)) {
		return fail(403, { message: 'You do not have permission to access this page.' });
	}

	const betaRecords = await db.betaAccess.findMany()

	const betaUserIds = betaRecords.map((record) => record.combineId);

	const betaUsers = await db.user.findMany({
		where: {
			combineId: {
				in: betaUserIds
			}
		}
	})

	return {
		betaUsers
	};
};

export const actions = {
	addUser: async ({ request, locals }) => {
		guard(locals, GlobalAdminAccessPolicy);
		const formData = await request.formData();
		const handle = formData.get('handle') as string;

		if (!handle) {
			return fail(400, { message: 'Handle is required' });
		}

		const handleCheck = await fetch(`https://www.swcombine.com/ws/v2.0/character/handlecheck/${handle}/`, {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!handleCheck.ok) {
			return fail(400, { message: 'Handle not found' });
		}

		const data = await handleCheck.json();

		const characterData = data.swcapi.character;

		if (characterData.handle != handle) {
			return fail(400, { message: 'Handle not found' });
		}

		console.log('Character data:', characterData);

		const betaUser = await db.betaAccess.upsert({
			where: {
				combineId: characterData.uid
			},
			create: {
				combineId: characterData.uid,
			},
			update: {}
		});

		const user = await db.user.upsert({
			where: {
				combineId: characterData.uid
			},
			create: {
				combineId: characterData.uid,
				username: characterData.handle,
				combineScopes: ["character_read"],
				role: 'Patron',
				profile: {
					create: {
						displayName: characterData.handle,
					}
				}
			},
			update: {
				username: characterData.handle,
			}
		});

		return {
			betaId: betaUser.id,
			userId: user.id,
		};
	},

	deleteUser: async ({ request, locals }) => {
		if (!guard(locals, GlobalAdminAccessPolicy)) {
			return error(403, { message: 'You do not have permission to perform this action.' });
		}

		const formData = await request.formData();
		const userId = formData.get('userId') as string;

		if (!userId) {
			return fail(400, { message: 'User ID is required' });
		}

		const user = await db.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) {
			return fail(404, { message: 'User not found' });
		}

		const betaRecord = await db.betaAccess.findUnique({
			where: {
				combineId: user.combineId
			}
		});

		if (!betaRecord) {
			return fail(404, { message: 'Beta access not found' });
		}
		const betaId = betaRecord.id;

		await db.betaAccess.delete({
			where: {
				id: betaId
			}
		});

		return {};
	}
};
