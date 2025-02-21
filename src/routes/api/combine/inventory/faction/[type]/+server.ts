import type { Character } from '$lib/models/combine/character.js';
import type { CombineResponse } from '$lib/models/combine/combine-response.js';
import type { CombinedInventoryResponse } from '$lib/models/general/combined-inventory.response.js';
import { Encryption } from '$lib/server/utils/encryption.js';
import { error } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import axios from 'axios';

export const GET = async ({ locals, cookies, params, url }) => {
	const accessToken = cookies.get('um_combine_access_token');

	if (!accessToken) {
		throw redirect(302, '/login');
	}

	const tags = url.searchParams.get('tags') as string;
	if (!tags) {
		throw error(400, { message: 'Tags are required!' });
	}

	const decryptedToken = new Encryption().descrypt(accessToken);

	let privilegeTypeCheck = '';

	switch (params.type) {
		case 'creatures':
			privilegeTypeCheck = 'creature';
			break;
		case 'droids':
			privilegeTypeCheck = 'droid';
			break;
		case 'facilities':
			privilegeTypeCheck = 'facility';
			break;
		case 'items':
			privilegeTypeCheck = 'item';
			break;
		case 'npcs':
			privilegeTypeCheck = 'npc';
			break;
		case 'ships':
			privilegeTypeCheck = 'ship';
			break;
		case 'stations':
			privilegeTypeCheck = 'station';
			break;
		case 'vehicles':
			privilegeTypeCheck = 'vehicle';
			break;
		case 'materials':
			privilegeTypeCheck = 'material';
			break;
		default:
			throw error(400, 'Unable to determine inventory type');
	}

	const { data: characterData } = await axios.get<Character>(
		`https://www.swcombine.com/ws/v2.0/character`,
		{
			headers: {
				Authorization: `OAuth ${decryptedToken}`,
				Accept: 'application/json'
			}
		}
	);

	const { data: privCheck } = await axios.get<CombineResponse>(
		`https://www.swcombine.com/ws/v2.0/character/${locals.user.combineId}/privileges/${privilegeTypeCheck}/makeover`,
		{
			headers: {
				Authorization: `OAuth ${decryptedToken}`,
				Accept: 'application/json'
			}
		}
	);

	if (privCheck.swcapi.privilege?.value === 'false') {
		throw error(403, {
			message:
				'Faction privileges denied. You must have makeover privileges to be able to view this inventory.'
		});
	}

	const factionId = characterData.swcapi.character.faction.attributes.uid;

	const combinedInventory: CombinedInventoryResponse[] = [];

	const baseUrl = `https://www.swcombine.com/ws/v2.0/inventory/${factionId}/${params.type}/owner`;
	const tagsArray = tags.split(',').map((tag) => tag.trim());
	const sp = new URLSearchParams();
	sp.append('filter_type[]', 'tags');
	sp.append('filter_inclusion[tags]', 'includes');
	tagsArray.forEach((tag) => {
		sp.append('filter_value[tags][]', tag);
	});

	// Combine manually built filter_value[tags] with URLSearchParams
	const requestUrl = `${baseUrl}?${sp.toString()}`;

	const { data } = await axios.get<CombineResponse>(`${requestUrl}`, {
		headers: {
			Authorization: `OAuth ${decryptedToken}`,
			Accept: 'application/json'
		}
	});

	data.swcapi.entities?.entity.forEach((entity) => {
		combinedInventory.push({
			uid: entity.value.uid,
			name: entity.value.name,
			quantity: entity.value.quantity || 1,
			entity: {
				uid: entity.value.type.attributes.uid,
				name: entity.value.type.value
			},
			images: {
				small: entity.value.images.small,
				large: entity.value.images.large,
				customSmall: entity.value.images.customsmall,
				customLarge: entity.value.images.customlarge
			},
			protected: entity.value.protected,
			wrecked: entity.value.wrecked,
			underConstruction: entity.value.underconstruction,
			hull: entity.value.hull && {
				max: entity.value.hull.attributes.max,
				value: entity.value.hull.value
			},
			shield: entity.value.shield && {
				max: entity.value.shield.attributes.max,
				value: entity.value.shield.value
			},
			ionic: entity.value.ionic && {
				max: entity.value.ionic.attributes.max,
				value: entity.value.ionic.value
			},
			container: entity.value.location.container.value,
			sector: entity.value.location.sector.value,
			system: entity.value.location.system.value,
			planet: entity.value.location.planet.value,
			coordinates: {
				galaxy: {
					x: entity.value.location.coordinates.galaxy.attributes?.x,
					y: entity.value.location.coordinates.galaxy.attributes?.y
				},
				system: {
					x: entity.value.location.coordinates.system.attributes?.x,
					y: entity.value.location.coordinates.system.attributes?.y
				},
				surface: {
					x: entity.value.location.coordinates.surface.attributes?.x,
					y: entity.value.location.coordinates.surface.attributes?.y
				},
				ground: {
					x: entity.value.location.coordinates.ground.attributes?.x,
					y: entity.value.location.coordinates.ground.attributes?.y
				}
			},
			tags: {
				tag: entity.value.tags.tag
			},
			cargo: entity.value.cargo && {
				uid: entity.value.cargo.entitytype.attributes.uid,
				name: entity.value.cargo.entitytype.value,
				maxUses: entity.value.cargo.maxuses,
				remainingUses: entity.value.cargo.remaininguses
			}
		});
	});

	return json({
		data: combinedInventory
	});
};
