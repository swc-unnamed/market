import type { Role } from '$lib/consts/roles';
import { error } from '@sveltejs/kit';

/**
 * Guard function to check if the user has the correct permission Policy
 * @param locals - Local context object
 * @param policy - Policy to validate against
 * @param message - Message to display if the user does not have the correct policy
 */
export function guard(locals: App.Locals, policy: Role[], message?: string) {
	if (!locals.user) {
		throw error(401, { message: 'Authentication required.' });
	}

	const allowed = policy.includes(locals.user.role);

	if (!allowed) {
		throw error(402, { message: message || 'You do not have permission to access this resource.' });
	}
}
