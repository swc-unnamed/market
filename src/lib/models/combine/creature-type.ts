export interface CreatureType {
	uid: string;
	name: string;
	description: string;
	class: Class;
	slotsize: number;
	species: string;
	basehp: number;
	weight: Volume;
	volume: Volume;
	homeworld: Homeworld;
	spawnterraintypes: Spawnterraintypes;
	terrainrestrictions: Terrainrestrictions;
	skills: Skills;
	images: Images;
}

export interface Class {
	attributes: ClassAttributes;
}

export interface ClassAttributes {
	uid: string;
	value: string;
}

export interface Homeworld {}

export interface Images {
	small: string;
	large: string;
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

export interface Spawnterraintypes {
	spawnterraintype: Spawnterraintype[];
}

export interface Spawnterraintype {
	attributes: SpawnterraintypeAttributes;
	value: string;
}

export interface SpawnterraintypeAttributes {
	uid: string;
	code: string;
	href: string;
}

export interface Terrainrestrictions {
	terrainrestriction: Spawnterraintype[];
}

export interface Volume {
	value: number;
	attributes: VolumeAttributes;
}

export interface VolumeAttributes {
	units: string;
}
