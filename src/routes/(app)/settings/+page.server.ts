import { MagistratePermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';

export const load = async ({ locals }) => {
	guard(locals, MagistratePermissionPolicy);
	return {};
};
