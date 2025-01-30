export interface WeaponType {
	uid: string;
	name: string;
	class: Class;
	damagetype: string;
	mindamage: number;
	maxdamage: number;
	optimumrange: number;
	maxhits: number;
	dropOff: number;
	firepower: number;
	tracking: number;
	poison: boolean;
	dual: boolean;
	images: Images;
}

export interface Class {
	attributes: Attributes;
}

export interface Attributes {
	uid: string;
	value: string;
}

export interface Images {
	small: string;
	large: string;
}
