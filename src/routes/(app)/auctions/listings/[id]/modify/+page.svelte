<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import CreditInput from '$lib/components/custom/inputs/credit-input.svelte';
	import EntityLookup from '$lib/components/custom/shared/entity-lookup.svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	let { data } = $props();
	let listing = $derived(data.listingRecord);
	let newItemDialogOpen = $state(true);

	const { form: itemForm, enhance: itemEnhance } = superForm(data.itemForm, {
		dataType: 'json'
	});
</script>

<LayoutWrapper title={listing?.title}>
	<div class="container">
		{#if listing?.status === 'draft'}
			<Alert.Root class="mb-3 border-primary">
				<Alert.AlertDescription>
					This listing is currently a draft. It will not be visible to other users until you set it
					to a status of New. You can view your draft listings <a href="#">here</a>.
				</Alert.AlertDescription>
			</Alert.Root>
		{/if}

		<div class="grid gap-3">
			<Card.Root>
				<Card.Header>
					<Card.Title>
						Modify Auction Listing: <span class="text-primary">{listing?.title}</span>
					</Card.Title>
					<Card.Description>
						<span>ALID: {listing?.listingNumber}</span>
					</Card.Description>
				</Card.Header>

				<Card.Content>
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
						<div class="col-span-2 grid gap-1">
							<Label>Title</Label>
							<Input />
						</div>
						<div class="col-span-2 grid gap-1">
							<Label>Details</Label>
							<Textarea placeholder="Have a sales pitch? Put that here" />
						</div>
						<div class="col-span-2 grid gap-1">
							<Label>Location</Label>
							<Textarea />
						</div>

						<div class="col-span-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
							<div>
								<CreditInput label="Starting Bid" />
							</div>

							<div class="flex flex-col gap-1">
								<Label>Remain Anonymous</Label>
								<Switch />
								<p class="text-xs text-muted-foreground">
									We won't pubically display your name as the seller and will use a Unnamed Market
									approved Middle.
								</p>
							</div>

							<div class="grid gap-1">
								<Label>Send Credits To</Label>
								<Input value={data.user.name} />
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div class="flex items-center justify-between">
							<span>Listing Items</span>
							<div class="flex gap-1">
								<Button
									size="sm"
									onclick={() => {
										toast('Not implemented yet, but soon(tm).');
									}}>Import From Combine</Button
								>
								<Button
									size="sm"
									onclick={() => {
										newItemDialogOpen = true;
									}}>Add Item</Button
								>
							</div>
						</div>
					</Card.Title>
				</Card.Header>

				<Card.Content>
					<p>blah</p>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</LayoutWrapper>

<Dialog.Root bind:open={newItemDialogOpen}>
	<Dialog.Content interactOutsideBehavior="ignore">
		<Dialog.Header>
			<Dialog.Title>Add Item to Listing</Dialog.Title>
		</Dialog.Header>

		<ScrollArea class="h-[600px] rounded-md drop-shadow-lg">
			<div class="grid gap-3">
				<div class="flex items-center justify-between rounded-md bg-sidebar p-3">
					<span>Entity Title</span>
					<EntityLookup
						entity={data.entityRecords!}
						name="entities"
						bind:value={$itemForm.entityId}
					/>
				</div>

				<div class="grid gap-1 rounded-md bg-sidebar p-3">
					<Label>Combine ID</Label>
					<Input bind:value={$itemForm.combineId} />
					<span class="text-sm text-muted-foreground">
						We use the Combine ID to track the asset on the holochain. While not required, it is a
						staple of the Unnamed Market. Review our <a href="/help#combine-id" target="_blank"
							>help</a
						> entry for more.
					</span>
				</div>

				<div class="grid gap-1 rounded-md bg-sidebar p-3">
					<Label>Asset Type</Label>
					<Input bind:value={$itemForm.entityType} />
					<span class="text-sm text-muted-foreground">
						The asset type is determined by the Asset Lookup.
					</span>
				</div>

				<div class="flex items-center justify-between rounded-md bg-sidebar p-3">
					<div class="flex flex-col items-start gap-1">
						<Label>U / U / U</Label>
						<span class="text-sm text-muted-foreground">
							Undocked, Undamaged, Unshielded. These are the conditions of the asset.
						</span>
					</div>
					<Switch bind:checked={$itemForm.uuu} />
				</div>

				<div class="flex items-center justify-between rounded-md bg-sidebar p-3">
					<div class="flex flex-col items-start gap-1">
						<Label>Custom Item?</Label>
						<span class="text-sm text-muted-foreground">
							Does this Asset have a custom image or is it a unique item?
						</span>
					</div>
					<Switch bind:checked={$itemForm.customItem} />
				</div>

				{#if $itemForm.customItem}
					<div class="grid gap-1 rounded-md bg-sidebar p-3">
						<Label>Custom Name</Label>
						<Input bind:value={$itemForm.customItemName} />
						<span class="text-sm text-muted-foreground"> </span>
					</div>

					<div class="grid gap-1 rounded-md bg-sidebar p-3">
						<Label>Custom Image URL</Label>
						<Input bind:value={$itemForm.customItemName} />
						<span class="text-sm text-muted-foreground">
							Right now, we do not allow direct uploads. You can upload to Discord and use the link
							here.
						</span>
					</div>
				{/if}
			</div>
		</ScrollArea>

		<Dialog.Footer>
			<Dialog.Close class="text-sm">Cancel</Dialog.Close>
			<Button variant="link">Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
