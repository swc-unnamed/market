import { env } from '$env/dynamic/private';
export const load = async ({ locals }) => {
	const host = env.UIM_BASE_URL;

	return {
		user: locals.user,
		baseUrl: host
	};
};
