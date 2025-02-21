<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import axios from 'axios';
	import Icon from '@iconify/svelte';
	import type { CombinedInventoryResponse } from '$lib/models/general/combined-inventory.response.js';
	import DataTable from './data-table/data-table.svelte';
	import { columns } from './data-table/columns.js';
	import { toast } from 'svelte-sonner';
	import CombineTagInput from '$lib/components/custom/shared/combine-tag-input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let { data } = $props();

	interface SelectOption {
		label: string;
		value: string;
		scope: string | null;
	}

	// TODO: Move to seperate file
	const personalSelectOptions: SelectOption[] = [
		{
			value: 'none',
			label: 'None',
			scope: null
		},
		{
			value: 'creatures',
			label: 'Creatures',
			scope: 'personal_inv_creatures_read'
		},
		{
			value: 'droids',
			label: 'Droids',
			scope: 'personal_inv_droids_read'
		},
		{
			value: 'facilities',
			label: 'Facilities',
			scope: 'personal_inv_facilities_read'
		},
		{
			value: 'items',
			label: 'Items',
			scope: 'personal_inv_items_read'
		},
		{
			value: 'materials',
			label: 'Materials',
			scope: 'personal_inv_materials_read'
		},
		{
			value: 'ships',
			label: 'Ships',
			scope: 'personal_inv_ships_read'
		},
		{
			value: 'stations',
			label: 'Stations',
			scope: 'personal_inv_stations_read'
		},
		{
			value: 'vehicles',
			label: 'Vehicles',
			scope: 'personal_inv_vehicles_read'
		}
	];
	const factionSelectOptions: SelectOption[] = [
		{
			value: 'none',
			label: 'None',
			scope: null
		},
		{
			value: 'creatures',
			label: 'Creatures',
			scope: 'faction_inv_creatures_read'
		},
		{
			value: 'droids',
			label: 'Droids',
			scope: 'faction_inv_droids_read'
		},
		{
			value: 'facilities',
			label: 'Facilities',
			scope: 'faction_inv_facilities_read'
		},
		{
			value: 'items',
			label: 'Items',
			scope: 'faction_inv_items_read'
		},
		{
			value: 'materials',
			label: 'Materials',
			scope: 'faction_inv_materials_read'
		},
		{
			value: 'ships',
			label: 'Ships',
			scope: 'faction_inv_ships_read'
		},
		{
			value: 'stations',
			label: 'Stations',
			scope: 'faction_inv_stations_read'
		},
		{
			value: 'vehicles',
			label: 'Vehicles',
			scope: 'faction_inv_vehicles_read'
		}
	];

	let selectedPersonalEntityType = $state<string>('none');
	let selectedFactionEntityType = $state<string>('none');
	let tags = $state<string[]>(['unnamed']);
	let selectedEntities = $state<CombinedInventoryResponse[]>([]);
	let availablePersonalEntities = $state<CombinedInventoryResponse[]>([]);
	let availableFactionEntities = $state<CombinedInventoryResponse[]>([]);

	async function getPersonalInventoryData(): Promise<CombinedInventoryResponse[]> {
		const { data } = await axios.get<{ data: CombinedInventoryResponse[] }>(
			`/api/combine/inventory/personal/${selectedPersonalEntityType}?tags=${tags.join(',')}`
		);

		availablePersonalEntities = data.data;

		return data.data;
	}

	async function getFactionInventoryData(): Promise<CombinedInventoryResponse[]> {
		const res = await fetch(
			`/api/combine/inventory/faction/${selectedFactionEntityType}?tags=${tags.join(',')}`
		);
		if (!res.ok) {
			const errmsg = await res.json();
			throw new Error(errmsg.message);
		}

		const d = await res.json();
		availableFactionEntities = d.data;
		return d.data;
		// return response.data.data;
	}

	async function handleSave() {
		const response = await axios.post(`/api/auctions/listings/${data.listingId}/import`, {
			data: selectedEntities
		});

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

	<div class="grid grid-cols-1 gap-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Combine Sync Terminal</Card.Title>
				<Card.Description class="grid grid-cols-1 gap-2">
					<span> Terminal Instructions </span>
					<span>
						This Terminal only searches your inventory based on the tags you provide. Multiple tags
						can be provided. Once you have entered the required tags, select the entity type you
						wish to search for. Once you have found the entities you wish to import, select them and
						click the "Import Selected" button.
					</span>
					<span class="text-xs text-muted-foreground">
						Depending on how many entities you have, this may take a moment or two. At max, we will
						only pull 200 entities. If you are not seeing the entities you are looking for, try
						refining your search tags and update the assets in Darkness.
					</span>
				</Card.Description>
			</Card.Header>
			<Card.Content class="grid grid-cols-1 gap-3">
				<Tabs.Root value="personal">
					<div class="flex items-center justify-between">
						<Tabs.List>
							<Tabs.Trigger value="personal">Personal Inventory</Tabs.Trigger>
							{#if data.user.scopes.includes('faction_inv_overview')}
								<Tabs.Trigger value="faction">Faction Inventory</Tabs.Trigger>
							{/if}
						</Tabs.List>

						<Button
							size="sm"
							variant="action"
							disabled={selectedEntities.length < 1}
							onclick={handleSave}
						>
							Import Selected
						</Button>
					</div>

					<Tabs.Content value="personal">
						<div class="mt-3 grid grid-cols-1 gap-3">
							<div class="grid grid-cols-1 gap-3 md:grid-cols-5">
								<CombineTagInput class="col-span-3" bind:tags />

								<div class="col-span-2 flex w-full flex-col gap-2">
									<Label>Entity Selection</Label>
									<Select.Root type="single" bind:value={selectedPersonalEntityType}>
										<Select.Trigger class="md:col-span-2" disabled={tags.length < 1}>
											{#if selectedPersonalEntityType === 'none'}
												Select Entity Type
											{:else}
												{#each personalSelectOptions as option}
													{#if option.value === selectedPersonalEntityType}
														{option.label}
													{/if}
												{/each}
											{/if}
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												{#each personalSelectOptions as option}
													<Select.Item value={option.value}>{option.label}</Select.Item>
												{/each}
											</Select.Group>
										</Select.Content>
									</Select.Root>
								</div>
							</div>
							<div class="grid grid-cols-1 gap-2">
								{#if selectedPersonalEntityType !== 'none'}
									{#await getPersonalInventoryData()}
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
														There was an error reaching into the Combine. Make sure you have entered
														tags.
													</span>

													<span class="text-xs text-danger">{error.message}</span>
												</Alert.Description>
											</Alert.Root>
										</div>
									{/await}
								{/if}
							</div>

							{#if selectedPersonalEntityType !== 'none' && availablePersonalEntities.length > 0}
								<DataTable
									{columns}
									bind:data={availablePersonalEntities}
									bind:selectedRows={selectedEntities}
								/>
							{/if}
							<!-- <pre>{JSON.stringify(selectedEntities, null, 2)}</pre> -->
						</div>
					</Tabs.Content>

					<Tabs.Content value="faction">
						<div class="mt-3 grid grid-cols-1 gap-3">
							<div class="grid grid-cols-1 gap-3 md:grid-cols-5">
								<CombineTagInput class="col-span-3" bind:tags />

								<div class="col-span-2 flex w-full flex-col gap-2">
									<Label>Entity Selection</Label>
									<Select.Root type="single" bind:value={selectedFactionEntityType}>
										<Select.Trigger class="md:col-span-2" disabled={tags.length < 1}>
											{#if selectedFactionEntityType === 'none'}
												Select Entity Type
											{:else}
												{#each factionSelectOptions as option}
													{#if option.value === selectedFactionEntityType}
														{option.label}
													{/if}
												{/each}
											{/if}
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												{#each factionSelectOptions as option}
													<Select.Item value={option.value}>{option.label}</Select.Item>
												{/each}
											</Select.Group>
										</Select.Content>
									</Select.Root>
								</div>
							</div>

							<div class="grid grid-cols-1 gap-2">
								{#if selectedFactionEntityType !== 'none'}
									{#await getFactionInventoryData()}
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
														There was an error reaching into the Combine. Make sure you have entered
														tags.
													</span>

													<span class="text-xs text-danger">{error.message}</span>
												</Alert.Description>
											</Alert.Root>
										</div>
									{/await}
								{/if}
							</div>

							{#if selectedFactionEntityType !== 'none' && availableFactionEntities.length > 0}
								<DataTable
									{columns}
									bind:data={availableFactionEntities}
									bind:selectedRows={selectedEntities}
								/>
							{/if}
							<!-- <pre>{JSON.stringify(selectedEntities, null, 2)}</pre> -->
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
