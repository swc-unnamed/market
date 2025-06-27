import type { UserContext } from "$lib/context/user.context";

declare global {
	namespace App {
		interface Locals {
			user: UserContext;
		}
	}
}

export { };

BigInt.prototype.toJSON = function () {
	return this.toString();
}