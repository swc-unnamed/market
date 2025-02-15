<script lang="ts">
	import Icon from '$lib/components/custom/shared/icon.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';

	let { data } = $props();

	let records = $derived(data.records);
	let currentRecords = $state(data.records);
	let selectedRecord = $state<(typeof records)[0] | null>(null);
	let editDialogOpen = $state(false);
	let activeSync = $state(false);
	let search = $state<string | null>(null);

	let updates: string[] = [];

	function startStream() {
		activeSync = true;
		const eventSource = new EventSource('/api/combine/entities/sync');

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			updates = [...updates, data.message];
			toast(data.message);
		};

		eventSource.onerror = async () => {
			console.error('Error occurred while streaming');
			activeSync = false;

			await invalidateAll();
			eventSource.close();
		};
	}

	$effect(() => {
		if (search) {
			currentRecords = data.records.filter((record) => {
				if (search) {
					return (
						record.name.toLowerCase().includes(search.toLowerCase()) ||
						record.type.toLowerCase().includes(search.toLowerCase())
					);
				}
			});
		} else {
			currentRecords = records;
		}
	});
</script>

<PageWrapper title="Entities">
	{#snippet right()}
		{#if ['market_tzar', 'holochain_architect'].includes(data.user.role)}
			<Button
				onclick={() => {
					startStream();
				}}
				disabled={activeSync}
			>
				<Icon icon="mdi:refresh" />
				Sync All Entities
			</Button>
		{/if}
	{/snippet}

	<Dialog.Root
		bind:open={editDialogOpen}
		onOpenChange={(open) => {
			if (!open) {
				selectedRecord = null;
			}
		}}
	>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title
					>Viewing: <span class="text-primary">{selectedRecord?.name}</span></Dialog.Title
				>
			</Dialog.Header>

			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-2">
					<Label>Name</Label>
					<Label>{selectedRecord?.name}</Label>
				</div>
				<div class="flex flex-col gap-2">
					<Label>Type</Label>
					<Label class="uppercase">{selectedRecord?.type}</Label>
				</div>
				<div class="flex flex-col gap-2">
					<Label>Combine UID</Label>
					<Label class="uppercase">{selectedRecord?.uid}</Label>
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>

	<div class="grid grid-cols-1 gap-3">
		<p>
			Entites are potential items that can be utilized on the Holochain. We strive to ensure all
			Entities are listed in the known universe, however if you have an entity that is not listed
			please contact the Market Tzar or a Holochain Architect.
		</p>

		<p class="text-sm">
			We currently have <span class="text-primary">{records.length}</span> entities in the database.
		</p>

		<div class="flex flex-col gap-3">
			<Label>Search the Entity DB</Label>
			<Input bind:value={search} placeholder="Search Entities" />
		</div>
	</div>

	<Table.Root class="mt-3">
		<Table.Header>
			<Table.Row>
				<Table.Cell class="w-1/3">Name</Table.Cell>
				<Table.Cell class="w-1/3">Type</Table.Cell>
				<Table.Cell class="w-1/3">Combine UID</Table.Cell>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each currentRecords as record}
				<Table.Row
					class="hover:cursor-pointer"
					onclick={() => {
						selectedRecord = record;
						editDialogOpen = true;
					}}
				>
					<Table.Cell>{record.name}</Table.Cell>
					<Table.Cell class="uppercase">{record.type}</Table.Cell>
					<Table.Cell>{record.uid}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</PageWrapper>
