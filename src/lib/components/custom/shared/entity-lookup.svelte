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

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger>
		{#if trigger}
			{@render trigger?.()}
		{:else}
			<Button size="sm" variant="secondary" onclick={() => (dialogOpen = true)}>
				<Icon icon="mdi:database" class="size-4" />
				Entity Lookup
			</Button>
		{/if}
	</Dialog.Trigger>
	<Dialog.Content class="mx-auto w-[90%] rounded-md p-3 md:w-1/2">
		<div class="grid grid-cols-1 gap-2">
			<div class="mt-3 grid grid-cols-1 gap-2">
				<Label>Entity Filter</Label>
				<Input
					bind:value={itemSearch}
					placeholder="Start typing to search our Entity holocron..."
				/>
				<ScrollArea class="mt-3 h-56 rounded-md p-1">
					<div class="grid grid-cols-1 gap-2 p-2">
						{#each filteredItems as item}
							{#if item.id && item.name}
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<div
									class="flex w-full items-center justify-between rounded-md border p-2 hover:cursor-pointer hover:bg-secondary"
									onclick={() => {
										selectedValue = item.id as string;
										name = item.name as string;
										value = item.id as string;
										type = item.type as string;
										dialogOpen = false;
									}}
								>
									<div class="flex flex-col">
										<span class="text-sm">{item.name}</span>
										<span class="text-xs uppercase">{item.type}</span>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</ScrollArea>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
