import { formatRole } from '../helpers/format-role';
export const Roles = [
	'patron',
	'auctioneer',
	'magistrate',
	'holochain_architect',
	'market_tzar'
] as const;

export type Role = (typeof Roles)[number];

export const RoleSelectOptions = Roles.map((role) => ({
	value: role,
	label: formatRole(role)
}));

/**
 * Client side role check
 * @param role {string} Role to check against
 * @param roles {Role[]} Array of roles to check against
 * @returns
 */
export const roleCheck = (role: string, roles: Role[]) => roles.includes(role as Role);
