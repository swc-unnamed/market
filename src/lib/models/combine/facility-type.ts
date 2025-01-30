export interface FacilityType {
	uid: string;
	name: string;
	description: string;
	class: Class;
	sensors: number;
	weight: Volume;
	volume: Volume;
	volumecapacity: Volume;
	maxpassengers: number;
	flats: number;
	jobs: number;
	sizex: number;
	sizey: number;
	hull: number;
	shield: number;
	ioniccapacity: number;
	energy: number;
	canloadmaterials: boolean;
	canearnincome: boolean;
	medicalrooms: number;
	hangarbay: string;
	dockingbay: string;
	canrecycle: string;
	canproduce: string;
	canmine: string;
	canrefinealazhi: string;
	canfarmalazhi: string;
	canresearch: string;
	weapons: Weapons;
	materials: Materials;
	price: Price;
	production: Production;
	imagesets: Imagesets;
}

export interface Class {
	attributes: ClassAttributes;
}

export interface ClassAttributes {
	uid: string;
	value: string;
}

export interface Imagesets {
	images: Image[];
}

export interface Image {
	small: string;
	largevertical: string;
	largehorizontal: string;
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

export interface Weapons {
	weapon: Material[];
}
