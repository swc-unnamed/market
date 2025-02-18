import type { CreatureType } from './creature-type';
import type { DroidType } from './droid-type';
import type { FacilityType } from './facility-type';
import type { Entities } from './inventory-response';
import type { ItemType } from './item-type';
import type { NpcType } from './npc-type';
import type { ShipType } from './ship-type';
import type { StationType } from './station-type';
import type { VehicleType } from './vehicle-type';
import type { WeaponType } from './weapon-type';

export interface CombineResponse {
	version: string;
	timestamp: number;
	resource: string;
	request: string;
	swcapi: Swcapi;
}

export interface Swcapi {
	shiptype?: ShipType;
	droidtype?: DroidType;
	itemtype?: ItemType;
	facilitytype?: FacilityType;
	vehicletype?: VehicleType;
	stationtype?: StationType;
	weapontype?: WeaponType;
	creaturetype?: CreatureType;
	npctype?: NpcType;
	entities?: Entities;
}
