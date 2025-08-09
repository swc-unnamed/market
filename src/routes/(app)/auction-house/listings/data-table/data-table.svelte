<script lang="ts">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		getCoreRowModel,
		getFilteredRowModel,
		getSortedRowModel,
		type PaginationState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { columns as tableColumns } from './columns';
	import { getTableData } from '../listings.remote';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let columns = tableColumns;

	let { items: data } = await getTableData();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let columnVisibility = $state<VisibilityState>(
		JSON.parse(
			localStorage.getItem('columnVisibility') ||
				JSON.stringify({ uuu: false, unique: false, customImage: false })
		) as VisibilityState
	);

	$inspect(columnVisibility);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}

			localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
		},
		state: {
			get columnVisibility() {
				return columnVisibility;
			}
		}
	});
</script>

<div class="rounded-md border">
	<div class="flex items-center p-3">
		<Input
			placeholder="Filter entities..."
			value={table.getColumn('entityName')?.getFilterValue() as string}
			onchange={(e) => table.getColumn('entityName')?.setFilterValue(e.currentTarget.value)}
			oninput={(e) => table.getColumn('entityName')?.setFilterValue(e.currentTarget.value)}
			class="max-w-sm"
		/>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} size="sm" variant="secondary" class="ml-auto">Columns</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
					{#if column.columnDef.enableColumnFilter !== false}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
						>
							{column.columnDef.header}
						</DropdownMenu.CheckboxItem>
					{/if}
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head colspan={header.colSpan}>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
