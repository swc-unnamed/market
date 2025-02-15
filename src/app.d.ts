// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import { Role } from '@prisma/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string;
				name: string;
				avatar: string | null;
				role: Role;
				scopes: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
