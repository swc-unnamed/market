<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import type { Selected } from 'bits-ui';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { EntityType } from '../../../models/zod';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Icon from './icon.svelte';
	import type { Snippet } from 'svelte';

	type EntityProps = {
		entity: EntityType[];
		value: string | null;
		trigger?: Snippet;
	};

	let { entity: items, value = $bindable(), trigger }: EntityProps = $props();

	let itemSearch = $state('');

	let selectedValue = $state('');
	let filteredItems = $state<EntityType[]>(items);

	$effect(() => {
		if (itemSearch) {
			filteredItems = items.filter((item) =>
				item.name?.toLowerCase().includes(itemSearch.toLowerCase())
			);
		} else {
			filteredItems = items;
		}
	});

	const itemContent = $derived(
		filteredItems.find((f) => f.id === selectedValue)?.name ?? 'Select an Item'
	);
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{#if trigger}
			{@render trigger?.()}
		{:else}
			<Button size="sm" variant="secondary">
				<Icon icon="mdi:database" class="size-4" />
				Asset Lookup
			</Button>
		{/if}
	</Dialog.Trigger>
	<Dialog.Content>
		<div class="grid grid-cols-1 gap-2">
			<div class="grid grid-cols-1 gap-2">
				<Label>Asset Filter</Label>
				<Input bind:value={itemSearch} placeholder="Start typing to search our Asset holocron..." />
				<ScrollArea class="mt-3 h-56 rounded-md border border-secondary p-1">
					<div class="grid grid-cols-1 gap-1">
						{#each filteredItems as item}
							{#if item.id && item.name}
								<Button
									variant="outline"
									onclick={() => {
										selectedValue = item.id as string;
										value = item.id as string;
									}}>{item.name}</Button
								>
							{/if}
						{/each}
					</div>
				</ScrollArea>

				<div class="flex justify-end">
					<Dialog.Close>
						<Button variant="outline">
							<Icon icon="mdi:check" class="size-4" />
							Confirm Selection
						</Button>
					</Dialog.Close>
				</div>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
