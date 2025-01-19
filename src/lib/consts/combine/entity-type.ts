export enum CombineEntityType {
	character = 1,
	ship = 2,
	vehicle = 3,
	facility = 4,
	station = 5,
	city = 7,
	planet = 8,
	npc = 10,
	creature = 11,
	item = 12,
	droid = 13,
	datacard = 14,
	material = 16,
	stock = 17,
	weapon = 18,
	customImage = 37
}

/**
 * @description CombineEntityTypeArray is an array of objects that contain the value and label of
 * each CombineEntityType. Typically used in dropdowns and other UI elements.
 */
export const CombineEntityTypeArray = [
	{
		value: CombineEntityType.ship,
		label: 'Ships'
	},
	{
		value: CombineEntityType.vehicle,
		label: 'Vehicles'
	},
	{
		value: CombineEntityType.facility,
		label: 'Facilities'
	},
	{
		value: CombineEntityType.station,
		label: 'Stations'
	},
	{
		value: CombineEntityType.city,
		label: 'Cities'
	},
	{
		value: CombineEntityType.planet,
		label: 'Planets'
	},
	{
		value: CombineEntityType.npc,
		label: 'NPCs'
	},
	{
		value: CombineEntityType.creature,
		label: 'Creatures'
	},
	{
		value: CombineEntityType.item,
		label: 'Items'
	},
	{
		value: CombineEntityType.droid,
		label: 'Droids'
	},
	{
		value: CombineEntityType.datacard,
		label: 'Datacards'
	},
	{
		value: CombineEntityType.material,
		label: 'Materials'
	},
	{
		value: CombineEntityType.stock,
		label: 'Stocks'
	},
	{
		value: CombineEntityType.weapon,
		label: 'Weapons'
	},
	{
		value: CombineEntityType.customImage,
		label: 'Custom Images'
	}
]