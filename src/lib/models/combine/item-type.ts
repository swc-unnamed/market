export interface ItemType {
	uid: string;
	name: string;
	description: string;
	class: Class;
	maxuses: number;
	lockable: string;
	batchquantity: number;
	weight: Volume;
	volume: Volume;
	weightcapacity: Volume;
	volumecapacity: Volume;
	equippableslots: Equippableslots;
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

export interface Equippableslots {
	equippableslot: string[];
}

export interface Images {
	small: string;
	large: string;
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

export interface Volume {
	value: number;
	attributes: VolumeAttributes;
}

export interface VolumeAttributes {
	units: string;
}

export interface Weapons {}
