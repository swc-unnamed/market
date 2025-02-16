import { SwcClient } from 'swcombine.js';

type CombineScope =
	| 'personal_inv_overview'
	| 'personal_inv_creatures_read'
	| 'personal_inv_droids_read'
	| 'personal_inv_facilities_read'
	| 'personal_inv_items_read'
	| 'personal_inv_materials_read'
	| 'personal_inv_npcs_read'
	| 'personal_inv_ships_read'
	| 'personal_inv_stations_read'
	| 'personal_inv_vehicles_read'
	| 'faction_inv_overview'
	| 'faction_inv_creatures_read'
	| 'faction_inv_droids_read'
	| 'faction_inv_facilities_read'
	| 'faction_inv_items_read'
	| 'faction_inv_materials_read'
	| 'faction_inv_npcs_read'
	| 'faction_inv_ships_read'
	| 'faction_inv_stations_read'
	| 'faction_inv_vehicles_read';

export type CombineScopeMap = Record<CombineScope, boolean>;
