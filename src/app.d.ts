import { Role } from '@prisma/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string;
				combineId: string;
				name: string;
				avatar: string | null;
				role: Role;
				scopes: string[];
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
