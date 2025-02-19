import { Checkbox } from '$lib/components/ui/checkbox/index.js';
import { renderComponent } from '$lib/components/ui/data-table';
import type { CombinedInventoryResponse } from '$lib/models/general/combined-inventory.response';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableImage from '$lib/components/ui/data-table/data-table-image.svelte';
import DataTableProgress from '$lib/components/ui/data-table/data-table-progress.svelte';
import DataTableCoordinates from '$lib/components/ui/data-table/data-table-coordinates.svelte';
import DataTableActions from '../../modify/data-table/data-table-actions.svelte';

export const columns: ColumnDef<CombinedInventoryResponse>[] = [
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
		accessorFn: (row) => {
			if (row.images.customSmall) {
				return row.images.customSmall;
			} else {
				return row.images.small;
			}
		},
		cell: ({ row }) => {
			const image = row.getValue('image');
			return renderComponent(DataTableImage, { imageUrl: image });
		}
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorFn: (row) => {
			return row.entity.name;
		},
		header: 'Entity Name'
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity'
	},
	{
		accessorKey: 'hull',
		header: 'Hull',
		cell: ({ row }) => {
			const hull = row.getValue('hull') as any;
			if (!hull) {
				return 'N/A';
			}
			return renderComponent(DataTableProgress, {
				max: hull.max,
				value: hull.value
			});
		}
	},
	{
		accessorKey: 'shield',
		header: 'Shields',
		cell: ({ row }) => {
			const shield = row.getValue('shield') as any;
			if (!shield) {
				return 'N/A';
			}
			return renderComponent(DataTableProgress, {
				max: shield.max,
				value: shield.value
			});
		}
	},
	{
		accessorKey: 'ionic',
		header: 'Ionic',
		cell: ({ row }) => {
			const ionic = row.getValue('ionic') as any;
			if (!ionic) {
				return 'N/A';
			}
			return renderComponent(DataTableProgress, {
				max: ionic.max,
				value: ionic.value
			});
		}
	},
	{
		accessorKey: 'container',
		header: 'Container'
	},
	{
		accessorKey: 'sector',
		header: 'Sector'
	},
	{
		accessorKey: 'system',
		header: 'System'
	},
	{
		accessorKey: 'protected',
		header: 'Protected'
	},
	{
		accessorFn: (row) => row.cargo?.name,
		header: 'Cargo'
	},
	{
		accessorFn: (row) => row.cargo,
		header: 'Uses',
		cell: ({ row }) => {
			const cargo = row.getValue('Uses') as any;
			if (!cargo) {
				return 'N/A';
			}
			return `${cargo.remainingUses}/${cargo.maxUses}`;
		}
	},
	{
		accessorKey: 'coordinates',
		header: 'Coordinates',
		cell: ({ row }) => {
			const coords = row.getValue('coordinates') as any;
			if (!coords) {
				return 'N/A';
			}

			const data = [
				{
					x: coords.galaxy.x,
					y: coords.galaxy.y,
					type: 'Galaxy'
				},
				{
					x: coords.system.x,
					y: coords.system.y,
					type: 'System'
				},
				{
					x: coords.surface?.x,
					y: coords.surface?.y,
					type: 'Surface'
				},
				{
					x: coords.ground?.x,
					y: coords.ground?.y,
					type: 'Ground'
				}
			];

			return renderComponent(DataTableCoordinates, {
				location: data
			});
		}
	}
];
