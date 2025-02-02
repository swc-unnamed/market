import { env } from '$env/dynamic/private';
export const load = async () => {
	const params = new URLSearchParams();

	params.append('client_id', env.COMBINE_CLIENT_ID);
	params.append('response_type', 'code');
	params.append('redirect_uri', `${env.UIM_BASE_URL}/callback`);
	params.append('scope', 'character_read');
	params.append('access_type', 'offline');
	params.append('renew_previously_granted', 'yes');

	const url = `https://www.swcombine.com/ws/oauth2/auth/?${params.toString()}`;

	return {
		url: url
	};
};
