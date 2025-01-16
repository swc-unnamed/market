export interface ShipType {
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
	escapepods: number;
	length: Length;
	hull: number;
	shield: number;
	armour: number;
	ioniccapacity: number;
	repulsors: string;
	slotsize: number;
	medicalrooms: number;
	asteroidprospectingsensors: number;
	asteroidminingpower: number;
	hangarbay: string;
	dockingbay: string;
	canrecycle: string;
	caninterdict: string;
	weapons: Weapons;
	materials: Materials;
	price: Price;
	production: Production;
	availableweight: number;
	availablevolume: number;
	deadweight: number;
	deadvolume: number;
	maxelectronicspower: number;
	maxenginepower: number;
	maxweaponspower: number;
	maxhullpower: number;
	totalpower: number;
	usedpower: number;
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
	hyperspace: number;
	sublight: Volume;
	planetary: Volume;
}

export interface Volume {
	value: number;
	attributes: LengthAttributes;
}

export interface Weapons {
	weapon: Material[];
}
