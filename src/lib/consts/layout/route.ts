export type Route = {
	title: string;
	href: string;
	icon?: string;
	isHref?: boolean;
	nested?: NestedRoute[];
	allowedRoles?: string[];
};

export type NestedRoute = Omit<Route, 'nested'>;
