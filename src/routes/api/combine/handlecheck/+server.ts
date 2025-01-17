import type { HandleCheckResponse } from '$lib/models/combine/handlecheck-response';
import { json } from '@sveltejs/kit';
import axios from 'axios';

export const GET = async ({ url }) => {
	const handle = url.searchParams.get('handle');
	if (!handle)
		return new Response(null, { status: 400, statusText: 'handle query parameter is required!' });
	try {
		const url = `https://www.swcombine.com/ws/v2.0/character/handlecheck/${handle}`;
		const { data } = await axios.get<HandleCheckResponse>(url, {
			headers: {
				Accept: 'application/json'
			},
			validateStatus: (status) => status >= 200 && status < 500
		});

		if ('character' in data.swcapi) {
			return json(data.swcapi.character);
		}

		if ('error_code' in data.swcapi && data.swcapi.error_code === 404) {
			return new Response(null, {
				status: 404,
				statusText: 'Handle not found.'
			});
		}

		return new Response(null, { status: 500, statusText: 'Error fetching data from API.' });
	} catch {
		return new Response(null, {
			status: 500,
			statusText: 'Error fetching data from API.'
		});
	}
};
