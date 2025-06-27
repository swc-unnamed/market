import type { Role } from "$lib/database/prisma";

export const UserContextKey = 'user_context';

export interface UserContext {
	id: string;
	username: string;
	combineId: string;
	combineScopes: string[];
	role: Role;
	profile: {
		id: string;
		displayName: string;
		avatar: string | null;
		reputation: number;
		activeOrganizationId?: string | null;
		activeOrganization: {
			id: string;
			name: string;
			slug: string;
			logoUrl: string | null;
			role: string;
		} | null;
		memberships: {
			id: string;
			organization: {
				id: string;
				name: string;
				slug: string;
				logoUrl: string | null;
				logoId: string | null;
				role: string;
			}
		}[];
	}
}