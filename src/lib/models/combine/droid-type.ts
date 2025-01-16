export interface DroidType {
	uid: string;
	name: string;
	description: string;
	class: Class;
	sensors: number;
	ecm: number;
	batchquantity: number;
	weight: Volume;
	volume: Volume;
	weightcapacity: Volume;
	volumecapacity: Volume;
	hull: number;
	shield: number;
	ioniccapacity: number;
	slotsize: number;
	terrainrestrictions: Terrainrestrictions;
	skills: Skills;
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

export interface Skills {
	general: General[];
	space: General[];
	ground: General[];
	social: General[];
	science: General[];
}

export interface General {
	attributes: GeneralAttributes;
	skill: Skill[];
}

export interface GeneralAttributes {
	force: string;
	count: number;
}

export interface Skill {
	attributes: SkillAttributes;
	value: number;
}

export interface SkillAttributes {
	type: string;
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
