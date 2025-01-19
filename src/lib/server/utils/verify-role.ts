import type { Role } from '$lib/consts/roles';
import { redirect } from '@sveltejs/kit';

type RoleCheckOpts = {
	userRole: Role;
	allowedRoles: Role[];
	redirectTo?: string;
};

// Check if the user has the required role to access the route. If not, redirect to the specified route.
// If no redirect route is specified, redirect to the home page.
export function verifyRole({ userRole, allowedRoles, redirectTo = '/home' }: RoleCheckOpts) {
	if (!allowedRoles.includes(userRole)) {
		return redirect(307, redirectTo);
	}
}
