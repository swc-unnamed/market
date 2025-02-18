import { Checkbox } from '$lib/components/ui/checkbox/index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { CombinedInventoryResponse } from '$lib/models/general/combined-inventory.response';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableImage from './data-table-image.svelte';
import DataTableProgress from './data-table-progress.svelte';
import type { HullMeta } from '$lib/models/combine/inventory-response';

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
	}
];
