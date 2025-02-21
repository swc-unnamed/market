export interface CombinedInventoryResponse {
	uid: string;
	name: string;
	entity: {
		uid: string;
		name: string;
	};
	images: {
		small: string;
		large: string;
		customSmall: string;
		customLarge: string;
	};
	protected?: string;
	wrecked?: string;
	underConstruction?: string;
	hull?: CombinedInventoryHullMeta;
	shield?: CombinedInventoryHullMeta;
	ionic?: CombinedInventoryHullMeta;
	container?: string;
	sector?: string;
	system?: string;
	planet?: string;
	city?: string;
	quantity?: number;
	coordinates: {
		galaxy?: CombinedInventoryCoordinates;
		system?: CombinedInventoryCoordinates;
		surface?: CombinedInventoryCoordinates;
		ground?: CombinedInventoryCoordinates;
	};
	tags: {
		tag: string[];
	};
	cargo?: {
		name: string;
		uid: string;
		maxUses: number;
		remainingUses: number;
	};
}

export interface CombinedInventoryHullMeta {
	max: number;
	value: number;
}

export interface CombinedInventoryCoordinates {
	x: string | number | undefined;
	y: string | number | undefined;
}
