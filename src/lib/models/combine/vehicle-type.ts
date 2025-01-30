export interface VehicleType {
	uid: string;
	name: string;
	description: string;
	class: Class;
	speed: Speed;
	manoeuvrability: number;
	sensors: number;
	ecm: number;
	weight: Volume;
	volume: Volume;
	weightcapacity: Volume;
	volumecapacity: Volume;
	maxpassengers: number;
	length: Length;
	hull: number;
	shield: number;
	ioniccapacity: number;
	repulsors: string;
	slotsize: number;
	medicalrooms: number;
	hangarbay: string;
	dockingbay: string;
	canrecycle: string;
	terrainrestrictions: Terrainrestrictions;
	weapons: Weapons;
	materials: Materials;
	price: Price;
	production: Production;
	images: Images;
}

export interface Class {
	attributes: ClassAttributes;
}

export interface ClassAttributes {
	uid: string;
	value: string;
}

export interface Images {
	small: string;
	large: string;
}

export interface Length {
	value: string;
	attributes: LengthAttributes;
}

export interface LengthAttributes {
	units: string;
}

export interface Materials {
	material: Material[];
}

export interface Material {
	attributes: MaterialAttributes;
	value: string;
}

export interface MaterialAttributes {
	uid: string;
	href: string;
	quantity: number;
}

export interface Price {
	credits: number;
}

export interface Production {
	modifier: number;
	recommendedWorkers: number;
	recyclingXP: string;
	genericSlots: number;
}

export interface Speed {
	planetary: Volume;
}

export interface Volume {
	value: number;
	attributes: LengthAttributes;
}

export interface Terrainrestrictions {
	terrainrestriction: Terrainrestriction[];
}

export interface Terrainrestriction {
	attributes: TerrainrestrictionAttributes;
	value: string;
}

export interface TerrainrestrictionAttributes {
	uid: string;
	code: string;
	href: string;
}

export interface Weapons {}
