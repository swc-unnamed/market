import { type Role, Roles } from '$lib/consts/roles';

export type Route = {
	title: string;
	href: string;
	icon?: string;
	isHref?: boolean;
	nested?: NestedRoute[];
	allowedRoles: Role[];
	disablePrefetch?: boolean;
};

export type NestedRoute = Omit<Route, 'nested'>;
