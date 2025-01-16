import type { DroidType } from './droid-type';
import type { ItemType } from './item-type';
import type { ShipType } from './ship-type';

export interface CombineAssetResponse {
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
}
