export interface NpcType {
	uid: string;
	name: string;
	description: string;
	class: Class;
	price: Price;
	hiringlocations: Hiringlocations;
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

export interface Hiringlocations {
	hiringlocation: Hiringlocation[];
}

export interface Hiringlocation {
	attributes: HiringlocationAttributes;
	value: string;
}

export interface HiringlocationAttributes {
	uid: string;
	href: string;
}

export interface Images {
	type: string;
}

export interface Price {
	credits: number;
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
	attributes: Images;
	value: number;
}
