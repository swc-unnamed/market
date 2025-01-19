import type { CombineAssetResponse } from '$lib/models/combine/asset-response.js';
import { db } from '$lib/server/db/index.js';
import { json } from '@sveltejs/kit';
import axios from 'axios';

export const GET = async ({ params }) => {
	const entity = await db.query.entities.findFirst({
		where: (r, { eq }) => eq(r.id, params.id)
	});

	console.log(entity);

	if (!entity) {
		return new Response(null, {
			status: 404,
			statusText: 'Asset not found. Ensure you are using the correct ID.'
		});
	}

	try {
		const { data } = await axios.get<CombineAssetResponse>(entity.apiLink, {
			headers: {
				Accept: 'application/json'
			}
		});

		console.log(JSON.stringify(data, null, 2));

		switch (entity.type) {
			case 'ships':
				return json({
					small: data.swcapi.shiptype?.images.small,
					large: data.swcapi.shiptype?.images.large
				});
			case 'droids':
				return json({
					small: data.swcapi.droidtype?.images.small,
					large: data.swcapi.droidtype?.images.large
				});

			case 'items':
				return json({
					small: data.swcapi.itemtype?.images.small,
					large: data.swcapi.itemtype?.images.large
				});

			// TODO: parse other asset types

			default:
				return json({
					small: null,
					large: null
				});
		}
	} catch {
		return new Response(null, {
			status: 500,
			statusText: 'Error fetching data from API.'
		});
	}
};
