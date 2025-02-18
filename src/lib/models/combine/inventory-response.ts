export interface Entities {
	attributes: Attributes;
	entity: Entity[];
}

export interface Attributes {
	start: number;
	total: number;
	count: number;
}

export interface Entity {
	attributes: EntityAttributes;
	value: EntityValue;
}

export interface EntityAttributes {
	href: string;
}

export interface EntityValue {
	uid: string;
	entitytype: string;
	name: string;
	owner: Attribute;
	infotext: string;
	images: Images;
	opento?: string;
	protected: string;
	wrecked?: string;
	hull?: HullMeta;
	shield?: HullMeta;
	ionic?: HullMeta;
	location: Location;
	type: Type;
	underconstruction: string;
	tags: Tags;
	pilot?: Attribute;
	quantity?: number;
}

export interface HullMeta {
	attributes: HullAttributes;
	value: number;
}

export interface HullAttributes {
	max: number;
}

export interface Images {
	small: string;
	large: string;
	customsmall: string;
	customlarge: string;
}

export interface Location {
	container: Attribute;
	sector: Attribute;
	system: Attribute;
	planet: Attribute;
	coordinates: Coordinates;
}

export interface Attribute {
	value?: string;
	attributes?: StandardAttribute;
}

export interface StandardAttribute {
	uid: string;
	type: string;
	href: string;
}

export interface Coordinates {
	galaxy: CoordinateAttribute;
	system: CoordinateAttribute;
	surface: CoordinateAttribute;
	ground: CoordinateAttribute;
}

export interface CoordinateAttribute {
	attributes: GalaxyCoordinate | null;
}

export interface GalaxyCoordinate {
	x: number | string;
	y: number | string;
}

export interface Tags {
	tag: string[];
}

export interface Type {
	attributes: TypeAttributes;
	value: string;
}

export interface TypeAttributes {
	uid: string;
	href: string;
}

export interface Filters {
	filter: any[];
}
