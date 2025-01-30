<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import type { Selected } from 'bits-ui';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { EntityType } from '../../../models/zod';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Icon from './icon.svelte';
	import type { Snippet } from 'svelte';

	type EntityProps = {
		entity: EntityType[];
		value: string | null;
		name: string | null;
		type?: string | null;
		trigger?: Snippet;
	};

	let {
		entity: items,
		value = $bindable(),
		name = $bindable(),
		type = $bindable(),
		trigger
	}: EntityProps = $props();

	let itemSearch = $state('');
	let selectedValue = $state('');
	let dialogOpen = $state(false);
	let filteredItems = $state<EntityType[]>(items);

	let comboBoxOpen = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	$effect(() => {
		if (itemSearch) {
			filteredItems = items.filter((item) =>
				item.name?.toLowerCase().includes(itemSearch.toLowerCase())
			);
		} else {
			filteredItems = items;
		}
	});

	// const itemContent = $derived(
	// 	filteredItems.find((f) => f.id === selectedValue)?.name ?? 'Select an Item'
	// );
</script>

<Drawer.Root bind:open={dialogOpen}>
	<Drawer.Trigger>
		{#if trigger}
			{@render trigger?.()}
		{:else}
			<Button size="sm" variant="secondary" onclick={() => (dialogOpen = true)}>
				<Icon icon="mdi:database" class="size-4" />
				Entity Lookup
			</Button>
		{/if}
	</Drawer.Trigger>
	<Drawer.Content class="mx-auto w-full p-3 md:w-1/2">
		<div class="grid grid-cols-1 gap-2">
			<div class="grid grid-cols-1 gap-2">
				<Label>Entity Filter</Label>
				<Input bind:value={itemSearch} placeholder="Start typing to search our Asset holocron..." />
				<ScrollArea class="mt-3 h-56 rounded-md border border-secondary p-1">
					<div class="grid grid-cols-1 gap-1">
						{#each filteredItems as item}
							{#if item.id && item.name}
								<Button
									variant="outline"
									class="flex w-full"
									onclick={() => {
										selectedValue = item.id as string;
										name = item.name as string;
										value = item.id as string;
										type = item.type as string;
										dialogOpen = false;
									}}
								>
									<div class="flex flex-col">
										<span>{item.name}</span>
										<span class="text-xs uppercase">{item.type}</span>
									</div>
								</Button>
							{/if}
						{/each}
					</div>
				</ScrollArea>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
