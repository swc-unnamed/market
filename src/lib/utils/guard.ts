import type { Role } from "$lib/database/prisma";
import { error } from "@sveltejs/kit";

export function guard(locals: App.Locals, policy: Role[]): boolean {
	if (!locals.user) {
		throw error(401, {
			message: "Authentication required.",
		});
	}

	return policy.includes(locals.user.role);
}
