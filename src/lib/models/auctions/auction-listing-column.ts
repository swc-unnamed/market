export interface AuctionListingColumn {
	id: string;
	assetId: null | string;
	entityId: string;
	uuu: boolean;
	quantity: number;
	isCustomItem: boolean;
	customName: string | null;
	customImage: string | null;
	uniqueItem: boolean;
	auctionListingId: string;
	combineImported: boolean;
	entity: AuctionListingColumnEntity;
	asset: AuctionListingColumnAsset | null;
}

export interface AuctionListingColumnAsset {
	id: string;
	entityId: string;
	combineId: string;
	type: string;
	customImage: string | null;
	customImageLarge: string | null;
	customImageSmall: string | null;
}

export interface AuctionListingColumnEntity {
	id: string;
	name: string;
	type: string;
	uid: string;
	apiLink: string;
	imageLarge: null | string;
	imageSmall: null | string;
}
