import { redirect } from "@sveltejs/kit"

export const load = async () => {
	await redirect(303, '/auction-house/dashboard')
}