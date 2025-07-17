import { env } from "$env/dynamic/private";

export const load = async () => {
	return {
		baseUrl: env.UM_BASE_URL,
	};
};
