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
