<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import * as Alert from '$lib/components/ui/alert';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import axios from 'axios';
	import Icon from '@iconify/svelte';
	import type { CombinedInventoryResponse } from '$lib/models/general/combined-inventory.response.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	const selectOptions: { label: string; value: string }[] = [
		{
			value: 'none',
			label: 'None'
		},
		{
			value: 'creatures',
			label: 'Creatures'
		},
		{
			value: 'droids',
			label: 'Droids'
		},
		{
			value: 'facilities',
			label: 'Facilities'
		},
		{
			value: 'items',
			label: 'Items'
		},
		{
			value: 'materials',
			label: 'Materials'
		},
		{
			value: 'ships',
			label: 'Ships'
		},
		{
			value: 'stations',
			label: 'Stations'
		},
		{
			value: 'vehicles',
			label: 'Vehicles'
		}
	];

	let selectedEntityType = $state<string>('ships');
	let selectedEntities = $state<CombinedInventoryResponse[]>([]);
	let availableEntities = $state<CombinedInventoryResponse[]>([]);

	async function getInventoryData(): Promise<CombinedInventoryResponse[]> {
		const response = await axios.get<{ data: CombinedInventoryResponse[] }>(
			`/api/combine/inventory/${selectedEntityType}`
		);

		availableEntities = response.data.data;

		return response.data.data;
	}

	async function handleSave() {
		const response = await axios.post(
			`/api/auctions/listings/${data.listingId}/import`,
			selectedEntities.map((entity) => {
				return {
					uid: entity.entity.uid,
					combineId: entity.uid
				};
			})
		);

		if (response.data.success) {
			toast.success('Entities have been imported successfully.');
		}
	}
</script>

<PageWrapper title="Combine Import">
	{#snippet right()}
		<Button variant="link" size="sm" href={`/auctions/listings/${data.listingId}/modify`}>
			Back
		</Button>
	{/snippet}

	<Card.Root>
		<Card.Header>
			<Card.Title>Combine Sync Terminal</Card.Title>
			<Card.Description class="grid grid-cols-1 gap-2">
				<span>
					Select the type of Entity, we reach out to the Combine and pull in the data for you. Rest
					easy, this terminal is encrypted. Depending on the scopes you have granted, will determine
					the options available to you.
				</span>
				<span class="text-xs text-muted-foreground">
					Depending on how many entities you have, this may take a moment or two.
				</span>
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid grid-cols-1 gap-3">
			<Select.Root type="single" bind:value={selectedEntityType}>
				<Select.Trigger>
					{#if selectedEntityType === 'none'}
						Select Entity Type
					{:else}
						{#each selectOptions as option}
							{#if option.value === selectedEntityType}
								{option.label}
							{/if}
						{/each}
					{/if}
				</Select.Trigger>
				<Select.Content>
					{#each selectOptions as option}
						<Select.Item value={option.value}>{option.label}</Select.Item>
					{/each}
				</Select.Content>

				{#if selectedEntities.length > 0}
					<Button variant="action" onclick={handleSave}>Add Selected</Button>
				{/if}
			</Select.Root>

			<div class="grid grid-cols-1 gap-2">
				{#if selectedEntityType !== 'none'}
					{#await getInventoryData()}
						<div class="mx-auto flex flex-col items-center justify-center">
							<Icon icon="svg-spinners:bars-scale-middle" class="size-12 text-primary" />
							<span class="text-sm text-muted-foreground">Terminal connecting...</span>
						</div>
					{:then data}
						<div class="grid grid-cols-1 gap-3">
							{#if data.length === 0}
								<Alert.Root>
									<Alert.Title>No Data</Alert.Title>
									<Alert.Description>
										There is no data available for the selected entity type.
									</Alert.Description>
								</Alert.Root>
							{/if}
						</div>
					{:catch error}
						<div>
							<Alert.Root>
								<Alert.Title>Terminal Error</Alert.Title>
								<Alert.Description class="grid grid-cols-1 gap-1">
									<span>
										There was an error reaching into the Combine. Did you forget to grant the
										scopes?
									</span>

									<span class="text-xs text-muted-foreground">{error.message}</span>
								</Alert.Description>
							</Alert.Root>
						</div>
					{/await}
				{/if}
			</div>
			<DataTable {columns} bind:data={availableEntities} bind:selectedRows={selectedEntities} />
		</Card.Content>
	</Card.Root>
</PageWrapper>
