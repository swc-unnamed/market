import { verifyRole } from '$lib/server/utils/verify-role.js';

export const load = async ({ locals }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: ['Magistrate', 'Holochain Architect', 'Market Tzar']
	});
	return {};
};
