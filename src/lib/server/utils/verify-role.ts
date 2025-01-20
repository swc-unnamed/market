import type { Role } from '$lib/consts/roles';
import { redirect } from '@sveltejs/kit';

type RoleCheckOpts = {
	/**
	 * The role of the user performing the action.
	 */
	userRole: Role;

	/**
	 * The roles that are allowed to access the route.
	 */
	allowedRoles: Role[];

	/**
	 * The route to redirect to if the user does not have the required role.
	 */
	redirectTo?: string;

	/**
	 * If true, do not redirect the user if they do not have the required role.
	 */
	noRedirect?: boolean;
};

/**
 * Check if the user has the required role to access the route. If not, redirect to the specified route.
 * If no redirect route is specified, redirect to the home page.
 * @param {RoleCheckOpts}
 * @returns
 */
export function verifyRole({
	userRole,
	allowedRoles,
	redirectTo = '/home',
	noRedirect = false
}: RoleCheckOpts): boolean | undefined {
	if (!allowedRoles.includes(userRole)) {
		if (redirectTo && !noRedirect) {
			redirect(307, redirectTo);
		}

		if (noRedirect) {
			return false;
		}
	}
	return true;
}
