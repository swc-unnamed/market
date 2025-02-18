import { Role } from '@prisma/client';

export interface UserContext {
	id: string;
	combineId: string;
	name: string;
	avatar: string | null;
	role: Role;
	scopes: string[];
}
