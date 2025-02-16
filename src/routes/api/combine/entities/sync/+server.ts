import { prisma } from '$lib/prisma.js';
import axios from 'axios';

export const GET = async ({ locals, setHeaders }) => {
	// Check that the current user has the permission to access this endpoint
	if (!['market_tzar', 'holochain_architect'].includes(locals.user.role)) {
		// If the user has the correct role, return a response
		return new Response(null, {
			status: 403,
			statusText: 'Forbidden'
		});
	}

	setHeaders({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	});

	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		async start(controller) {
			// Sync Ships
			controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: `Sync: Ships` })}\n\n`));
			await syncShips();

			// Sync Vehicles
			controller.enqueue(
				encoder.encode(`data: ${JSON.stringify({ message: `Sync: Vehicles` })}\n\n`)
			);
			await syncVehicles();

			// Sync Stations
			controller.enqueue(
				encoder.encode(`data: ${JSON.stringify({ message: `Sync: Stations` })}\n\n`)
			);
			await syncStations();

			// Sync Facilities
			controller.enqueue(
				encoder.encode(`data: ${JSON.stringify({ message: `Sync: Facilities` })}\n\n`)
			);
			await syncFacilities();

			// Sync Items
			controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: `Sync: Items` })}\n\n`));
			await syncItems();

			// Sync NPCs
			controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: `Sync: NPCs` })}\n\n`));
			await syncNpcs();

			// Sync Droids
			controller.enqueue(
				encoder.encode(`data: ${JSON.stringify({ message: `Sync: Droids` })}\n\n`)
			);
			await syncDroids();

			// Sync Materials
			controller.enqueue(
				encoder.encode(`data: ${JSON.stringify({ message: `Sync: Materials` })}\n\n`)
			);
			await syncMaterials();

			// Sync Weapons
			controller.enqueue(
				encoder.encode(`data: ${JSON.stringify({ message: `Sync: Weapons` })}\n\n`)
			);
			await syncWeapons();

			// Sync Creatures
			controller.enqueue(
				encoder.encode(`data: ${JSON.stringify({ message: `Sync: Creatures` })}\n\n`)
			);
			await syncCreatures();

			controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: `Sync: Done` })}\n\n`));
		}
	});

	return new Response(stream);
};

async function syncShips() {
	const { data } = await axios.get('https://www.swcombine.com/ws/v2.0/types/ships?start_index=1', {
		headers: {
			Accept: 'application/json'
		}
	});

	const totalRecords: number = data.swcapi.shiptypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/ships?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.shiptypes.shiptype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'ships',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'ships'
				}
			});
		}

		i += 50;
	}
}

async function syncVehicles() {
	const { data } = await axios.get(
		'https://www.swcombine.com/ws/v2.0/types/vehicles?start_index=1',
		{
			headers: {
				Accept: 'application/json'
			}
		}
	);

	const totalRecords: number = data.swcapi.vehicletypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/vehicles?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.vehicletypes.vehicletype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'vehicles',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'vehicles'
				}
			});
		}

		i += 50;
	}
}

async function syncStations() {
	const { data } = await axios.get(
		'https://www.swcombine.com/ws/v2.0/types/stations?start_index=1',
		{
			headers: {
				Accept: 'application/json'
			}
		}
	);

	const totalRecords: number = data.swcapi.stationtypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/stations?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.stationtypes.stationtype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			console.log(`name: ${name}, uid: ${uid}`);

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'stations',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'stations'
				}
			});
		}

		i += 50;
	}
}

async function syncFacilities() {
	const { data } = await axios.get(
		'https://www.swcombine.com/ws/v2.0/types/facilities?start_index=1',
		{
			headers: {
				Accept: 'application/json'
			}
		}
	);

	const totalRecords: number = data.swcapi.facilitytypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/facilities?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.facilitytypes.facilitytype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'facilities',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'facilities'
				}
			});
		}

		i += 50;
	}
}

async function syncItems() {
	const { data } = await axios.get('https://www.swcombine.com/ws/v2.0/types/items?start_index=1', {
		headers: {
			Accept: 'application/json'
		}
	});

	const totalRecords: number = data.swcapi.itemtypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/items?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.itemtypes.itemtype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'items',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'items'
				}
			});
		}

		i += 50;
	}
}

async function syncNpcs() {
	const { data } = await axios.get('https://www.swcombine.com/ws/v2.0/types/npcs?start_index=1', {
		headers: {
			Accept: 'application/json'
		}
	});

	const totalRecords: number = data.swcapi.npctypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/npcs?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.npctypes.npctype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'npcs',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'npcs'
				}
			});
		}

		i += 50;
	}
}

async function syncDroids() {
	const { data } = await axios.get('https://www.swcombine.com/ws/v2.0/types/droids?start_index=1', {
		headers: {
			Accept: 'application/json'
		}
	});

	const totalRecords: number = data.swcapi.droidtypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/droids?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.droidtypes.droidtype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'droids',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'droids'
				}
			});
		}

		i += 50;
	}
}

async function syncMaterials() {
	const { data } = await axios.get(
		'https://www.swcombine.com/ws/v2.0/types/materials?start_index=1',
		{
			headers: {
				Accept: 'application/json'
			}
		}
	);

	const totalRecords: number = data.swcapi.materialtypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/materials?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.materialtypes.materialtype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'materials',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'materials'
				}
			});
		}

		i += 50;
	}
}

async function syncWeapons() {
	const { data } = await axios.get(
		'https://www.swcombine.com/ws/v2.0/types/weapons?start_index=1',
		{
			headers: {
				Accept: 'application/json'
			}
		}
	);

	const totalRecords: number = data.swcapi.weapontypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/weapons?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.weapontypes.weapontype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'weapons',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'weapons'
				}
			});
		}

		i += 50;
	}
}

async function syncCreatures() {
	const { data } = await axios.get(
		'https://www.swcombine.com/ws/v2.0/types/creatures?start_index=1',
		{
			headers: {
				Accept: 'application/json'
			}
		}
	);

	const totalRecords: number = data.swcapi.creaturetypes.attributes.total;
	const startIndex = 1;

	for (let i = startIndex; i <= totalRecords; i++) {
		const { data } = await axios.get(
			`https://www.swcombine.com/ws/v2.0/types/creatures?start_index=${i}`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		for (const d of data.swcapi.creaturetypes.creaturetype) {
			const uid = d.attributes.uid;
			const apiUrl = d.attributes.href;
			const name = d.value;

			await prisma.entity.upsert({
				where: { uid: uid },
				create: {
					name: name,
					uid: uid,
					type: 'creatures',
					apiLink: apiUrl
				},
				update: {
					name: name,
					apiLink: apiUrl,
					uid: uid,
					type: 'creatures'
				}
			});
		}

		i += 50;
	}
}
