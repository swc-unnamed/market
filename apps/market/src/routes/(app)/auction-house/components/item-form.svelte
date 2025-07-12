<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { AuctionItem } from '$lib/models/schemas/auction-item.schema';
	import { auctionItemSchema } from '$lib/models/schemas/auction-item.schema.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import type { Entity } from '$lib/database/db';
	import { toast } from 'svelte-sonner';
	import * as Avatar from '$lib/components/ui/avatar';

	let {
		data
	}: {
		data: {
			itemForm: SuperValidated<Infer<AuctionItem>>;
			entities: Entity[];
		};
	} = $props();

	const form = superForm(data.itemForm, {
		validators: zodClient(auctionItemSchema),
		dataType: 'json',
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message || 'Item added successfully!');
			} else {
				toast.error('Failed to add item.');
			}
		}
	});

	let entityDialogOpen = $state(false);
	let searchText = $state('');
	let filteredEntities = $derived(
		data.entities.filter((entity) =>
			entity.name.toLowerCase().includes(searchText.toLowerCase().trimEnd())
		)
	);

	let selectedEntity = $state<Entity | null>(null);

	const { form: formData, enhance } = form;
</script>

<Card.Root>
	<Card.Content>
		<form class="grid grid-cols-1 gap-3" use:enhance method="POST" action="?/add_item">
			{#if $formData.entityId}
				{#if selectedEntity}
					<div class="flex justify-center">
						<img src={selectedEntity.imageLarge} class="h-72 rounded-lg" alt="selected entity" />
					</div>
				{/if}
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} readonly />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="quantity">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Quantity</Form.Label>
							<Input {...props} bind:value={$formData.quantity} type="number" />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field
					{form}
					name="uuu"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control>
						{#snippet children({ props })}
							<div class="space-y-0.5">
								<Form.Label>Unused / Undocked / Undamaged</Form.Label>
								<Form.Description>Verify the state of the item.</Form.Description>
							</div>
							<Switch {...props} checked={$formData.uuu} />
						{/snippet}
					</Form.Control>
				</Form.Field>

				<Form.Field
					{form}
					name="unique"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control>
						{#snippet children({ props })}
							<div class="space-y-0.5">
								<Form.Label>Unique</Form.Label>
								<Form.Description>
									If the item is unique, such as a custom image attached to an item, switch this
									option to true.
								</Form.Description>
							</div>
							<Switch {...props} bind:checked={$formData.unique} />
						{/snippet}
					</Form.Control>
				</Form.Field>

				{#if $formData.unique}
					<Form.Field {form} name="customName">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Custom Item Name</Form.Label>
								<Input {...props} bind:value={$formData.customName} />
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="customImage">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Custom Item Image</Form.Label>
								<Input {...props} bind:value={$formData.customImage} />
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>
				{/if}
				<div class="flex justify-end">
					<Form.Button type="submit">Add Item</Form.Button>
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center">
					<span>Select an Entity to continue</span>
					<Button onclick={() => (entityDialogOpen = true)}>Select Entity</Button>
				</div>
			{/if}
		</form>
	</Card.Content>
</Card.Root>

<Dialog.Root bind:open={entityDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Select Entity</Dialog.Title>
		</Dialog.Header>
		<Input placeholder="Search for an entity..." bind:value={searchText} />
		<div class="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto rounded-lg border p-3">
			{#each filteredEntities as entity}
				<button
					class="hover:text-primary text-left hover:cursor-pointer"
					onclick={() => {
						$formData.entityId = entity.id;
						$formData.name = entity.name;
						selectedEntity = entity;
						entityDialogOpen = false;
					}}
				>
					<div class="flex items-center gap-2">
						<Avatar.Root class="size-24 rounded-none">
							<Avatar.Image class="rounded-none" src={entity.imageSmall} alt={entity.name} />
							<Avatar.Fallback
								class="flex h-24 w-24 items-center justify-center text-wrap rounded-none p-3 text-xs"
							>
								{entity.name}
							</Avatar.Fallback>
						</Avatar.Root>
						<span class="text-sm">{entity.name}</span>
					</div>
				</button>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
