import type { CombineAssetResponse } from '$lib/models/combine/asset-response.js';
import { prisma } from '$lib/prisma.js';
import { json } from '@sveltejs/kit';
import axios from 'axios';

export const GET = async ({ params }) => {
	const entity = await prisma.entity.findUnique({
		where: { id: params.entityId }
	});

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

			case 'facilities':
				return json({
					small: data.swcapi.facilitytype?.imagesets.images[0].small,
					large: data.swcapi.facilitytype?.imagesets.images[0].largevertical
				});

			case 'vehicles':
				return json({
					small: data.swcapi.vehicletype?.images.small,
					large: data.swcapi.vehicletype?.images.large
				});

			case 'stations':
				return json({
					small: data.swcapi.stationtype?.images.small,
					large: data.swcapi.stationtype?.images.large
				});

			case 'weapons':
				return json({
					small: data.swcapi.weapontype?.images.small,
					large: data.swcapi.weapontype?.images.large
				});

			case 'creatures':
				return json({
					small: data.swcapi.creaturetype?.images.small,
					large: data.swcapi.creaturetype?.images.large
				});

			case 'npcs':
				return json({
					small: data.swcapi.npctype?.images.type,
					large: data.swcapi.npctype?.images.type
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
