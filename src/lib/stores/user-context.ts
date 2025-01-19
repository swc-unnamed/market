import type { Role } from '$lib/consts/roles';

export interface UserContext {
	id: string;
	name: string;
	avatar: string | null;
	role: Role;
}
