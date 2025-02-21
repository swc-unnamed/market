import { Checkbox } from '$lib/components/ui/checkbox';
import { renderComponent } from '$lib/components/ui/data-table';
import type { AuctionListingColumn } from '$lib/models/auctions/auction-listing-column';
import DataTableImage from './data-table-image.svelte';
import type { ColumnDef } from '@tanstack/table-core';
import AssetImage from '$lib/components/custom/assets/asset-image.svelte';
import DataTableActions from './data-table-actions.svelte';

export const columns: ColumnDef<AuctionListingColumn>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		id: 'image',
		header: '',
		accessorFn: (row) => {
			if (row.asset?.customImageSmall) {
				return row.asset.customImageSmall;
			} else {
				return row.entity.imageSmall;
			}
		},
		cell: ({ row }) => {
			const image = row.getValue('image');
			const entityId = row.getValue('entityId') as string;

			if (image) {
				return renderComponent(DataTableImage, { imageUrl: image });
			} else {
				return renderComponent(AssetImage, { id: entityId });
			}
		}
	},
	{
		accessorFn: (row) => row.entity.name,
		header: 'Entity Name'
	},
	{
		accessorKey: 'uuu',
		header: 'UUU',
		cell: ({ row }) => {
			const uuu = row.getValue('uuu');
			return `${uuu ? 'Yes' : 'No'}`;
		}
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity'
	},
	{
		accessorKey: 'entityId',
		header: 'Entity Hash'
	},
	{
		accessorKey: 'combineImported',
		header: 'Item Verification',
		cell: ({ row }) => {
			if (row.original.combineImported) {
				return 'Verified';
			} else {
				return 'Unverified';
			}
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				id: row.original.id,
				assetId: row.original.assetId,
				listingId: row.original.auctionListingId
			});
		}
	}
];
