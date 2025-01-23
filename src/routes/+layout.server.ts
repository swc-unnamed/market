import { env } from '$env/dynamic/private';

export const load = async () => {
	return {
		baseUrl: env.UIM_BASE_URL
	};
};
