<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as Table from '$lib/components/ui/table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import CreditInput from '$lib/components/custom/inputs/credit-input.svelte';
	import EntityLookup from '$lib/components/custom/shared/entity-lookup.svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import AssetImage from '$lib/components/custom/assets/asset-image.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { goto, invalidate } from '$app/navigation';

	let { data } = $props();
	let listing = $derived(data.listingRecord);
	let newItemDrawerOpen = $state(false);
	let deleteItemDialogOpen = $state(false);
	let publishDialogOpen = $state(false);
	let deleteListingDialogOpen = $state(false);

	const { form: itemForm, enhance: itemEnhance } = superForm(data.itemForm, {
		dataType: 'json',
		id: 'itemForm',
		onResult: ({ result }) => {
			console.log(result);
			switch (result.type) {
				case 'success':
					toast('Item added to listing');
					newItemDrawerOpen = false;
					break;
				case 'failure':
					toast('Failed to add item to listing');
					break;
			}
		}
	});

	const { form: listingForm, enhance: listingEnhance } = superForm(data.listingForm, {
		dataType: 'json',
		id: 'listingForm',
		onResult: ({ result }) => {
			console.log(result);
			switch (result.type) {
				case 'success':
					toast('Listing updated');
					break;
				case 'failure':
					toast('Failed to update listing');
					break;
			}
		}
	});

	async function handleItemDelete({ listingId, itemId }: { listingId: string; itemId: string }) {
		const res = await fetch(`/api/auctions/listings/${listingId}/items/${itemId}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			const data = await res.json();
			deleteItemDialogOpen = false;
			toast(data.message);
			await invalidate('auction_listing_modify');
		} else {
			toast('Failed to delete item');
			deleteItemDialogOpen = false;
		}
	}

	async function handlePublish() {
		const res = await fetch(`/api/auctions/listings/${listing?.id}`, {
			method: 'POST',
			body: JSON.stringify({
				action: 'publish',
				id: listing?.id
			})
		});

		if (res.ok) {
			const data = await res.json();
			toast(data.message);
			publishDialogOpen = false;
			await invalidate('auction_listing_modify');
		} else {
			publishDialogOpen = false;
			toast('Failed to publish listing');
		}
	}

	async function handleDelete() {
		const res = await fetch(`/api/auctions/listings/${listing?.id}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			const data = await res.json();
			toast(data.message);
			await goto('/home');
		} else {
			toast('Failed to delete listing');
		}
	}
</script>

<PageWrapper title={listing?.title}>
	<div class="mb-3 md:container md:mb-0">
		{#if listing?.status === 'draft'}
			<Alert.Root class="mb-3 border-primary">
				<Alert.AlertDescription>
					This listing is currently a draft. It will not be visible to other users until you set it
					to a status of New. You can view your draft listings <a href="/auctions/draft-listings"
						>here</a
					>.
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
							<Input bind:value={$listingForm.title} />
						</div>
						<div class="col-span-2 grid gap-1">
							<Label>Details</Label>
							<Textarea
								bind:value={$listingForm.details}
								placeholder="Have a sales pitch? Put that here"
							/>
						</div>
						<div class="col-span-2 grid gap-1">
							<Label>Location</Label>
							<Textarea bind:value={$listingForm.location} />
						</div>

						<div class="col-span-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
							<div>
								<CreditInput label="Starting Bid" bind:value={$listingForm.startingPrice} />
							</div>

							<div class="flex flex-col gap-1">
								<Label>Remain Anonymous</Label>
								<Switch bind:checked={$listingForm.listerIsAnon} />
								<p class="text-xs text-muted-foreground">
									We won't pubically display your name as the seller and will use a Unnamed Market
									approved Middle.
								</p>
							</div>

							<div class="grid gap-1">
								<Label>Send Credits To</Label>
								<Input bind:value={$listingForm.sendCreditsTo} />
							</div>
						</div>
					</div>
				</Card.Content>
				<Card.Footer class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div class="flex w-full items-center gap-3">
						<AlertDialog.Root bind:open={deleteListingDialogOpen}>
							<AlertDialog.Trigger class="w-full md:w-auto">
								<Button size="sm" variant="action" class="w-full text-red-500 md:w-auto">
									<AurebeshText text="D" />
									Delete Listing
								</Button>
							</AlertDialog.Trigger>
							<AlertDialog.Content>
								<AlertDialog.Header>
									<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
									<AlertDialog.Description>
										You are about to delete this listing. Are you sure you want to do this?
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
									<AlertDialog.Action
										class="bg-red-500"
										onclick={async () => {
											await handleDelete();
										}}>Yes, delete it</AlertDialog.Action
									>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</div>
					<div class="flex w-full items-center gap-3 md:w-auto">
						<div class="flex w-full flex-col items-center gap-3 md:flex-row">
							{#if listing.status === 'draft'}
								<AlertDialog.Root bind:open={publishDialogOpen}>
									<AlertDialog.Trigger class="w-full md:w-auto">
										<Button size="sm" variant="action" class="w-full border-primary md:w-auto">
											<AurebeshText text="P" />
											Publish
										</Button>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
											<AlertDialog.Description>
												Once you publish the listing, it will be visible to all users. You will not
												be able to make changes, only cancel the listing and create a new one. Are
												you sure you want to publish to the holochain?
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<AlertDialog.Action
												onclick={async () => {
													await handlePublish();
												}}>Continue</AlertDialog.Action
											>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							{/if}
							<form class="w-full" action="?/save" method="post" use:listingEnhance>
								<Button size="sm" variant="outline" class="w-full border-primary" type="submit">
									<AurebeshText text="S" />
									Save
								</Button>
							</form>
						</div>
					</div>
				</Card.Footer>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div class="flex flex-col justify-between md:flex-row md:items-center">
							<span>Listing Items</span>
							<div class="mt-3 flex flex-col gap-1 md:mt-0 md:flex-row">
								<Button
									size="sm"
									variant="ghost"
									onclick={() => {
										toast(
											"Not implemented yet, but hey, we are working on it. Just want to make sure it's right before we release it to you all. -M"
										);
									}}>Import From Combine</Button
								>
								<Button
									size="sm"
									variant="outline"
									class="border-primary"
									onclick={() => {
										newItemDrawerOpen = true;
									}}
								>
									<AurebeshText text="AI" />
									Add Item
								</Button>
							</div>
						</div>
					</Card.Title>
				</Card.Header>

				<Card.Content>
					<div class="hidden md:flex">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Cell>Image</Table.Cell>
									<Table.Cell>Name</Table.Cell>
									<Table.Cell>U / U / U</Table.Cell>
									<Table.Cell>Type</Table.Cell>
									<Table.Cell>Combine ID</Table.Cell>
									<Table.Cell></Table.Cell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each listing?.items as item}
									<Table.Row>
										<Table.Cell class="w-48">
											{#if item.customImageUrl}
												<img src={item.customImageUrl} alt={item.customItemName} class="h-8 w-8" />
											{:else if item.entityId}
												<AssetImage class="h-[100px] w-[100px] drop-shadow-md" id={item.entityId} />
											{/if}
										</Table.Cell>
										<Table.Cell class="w-52">
											{item.customItemName ? item.customItemName : item.entity?.name}
										</Table.Cell>
										<Table.Cell>
											{#if item.uuu}
												<Badge>U / U / U: Yes</Badge>
											{:else}
												<Badge>U / U / U: No</Badge>
											{/if}
										</Table.Cell>
										<Table.Cell>
											<span class="uppercase">
												{item.entity?.type}
											</span>
										</Table.Cell>
										<Table.Cell>
											{#if item.assetId}
												{item.assetId}
											{:else}
												N/A
											{/if}
										</Table.Cell>
										<Table.Cell class="w-56">
											<AlertDialog.Root bind:open={deleteItemDialogOpen}>
												<AlertDialog.Trigger class="w-full md:w-auto">
													<Button size="sm" variant="action" class="text-red-500">
														<AurebeshText text="D" />
														Delete
													</Button>
												</AlertDialog.Trigger>
												<AlertDialog.Content>
													<AlertDialog.Header>
														<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
														<AlertDialog.Description>
															We wil delete this item from the listing. We won't be able to add it
															back, but you can always add a new item.
														</AlertDialog.Description>
													</AlertDialog.Header>
													<AlertDialog.Footer>
														<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
														<AlertDialog.Action
															onclick={async () => {
																await handleItemDelete({ listingId: listing?.id, itemId: item.id });
															}}>Continue</AlertDialog.Action
														>
													</AlertDialog.Footer>
												</AlertDialog.Content>
											</AlertDialog.Root>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>

					<div class="grid grid-cols-1 gap-3 md:hidden">
						{#each listing?.items as item}
							<div class="rounded-md bg-sidebar p-3">
								<div class="flex items-start justify-between">
									<div class="flex gap-1">
										<div>
											{#if item.customImageUrl}
												<img src={item.customImageUrl} alt={item.customItemName} class="h-8 w-8" />
											{:else if item.entityId}
												<AssetImage class="h-[100px] w-[100px] drop-shadow-md" id={item.entityId} />
											{/if}
										</div>

										<div class="flex flex-col gap-1">
											<div>
												<span>{item.customItemName ? item.customItemName : item.entity?.name}</span>
											</div>

											<div>
												{#if item.uuu}
													<Badge>U / U / U: Yes</Badge>
												{:else}
													<Badge>U / U / U: No</Badge>
												{/if}
											</div>

											<div>
												<span class="uppercase">{item.entity?.type}</span>
											</div>

											<div>
												<span
													>{#if item.assetId}
														{item.assetId}
													{:else}
														N/A
													{/if}</span
												>
											</div>
										</div>
									</div>

									<div class="flex items-center">
										<Button size="icon" variant="action">
											<AurebeshText text="E" class="text-primary" />
										</Button>
										<Button size="icon" variant="action">
											<AurebeshText text="D" class="text-red-500" />
										</Button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</PageWrapper>

<Drawer.Root bind:open={newItemDrawerOpen}>
	<Drawer.Content interactOutsideBehavior="ignore" class="mx-auto w-full p-3 md:w-1/2">
		<Drawer.Header>
			<Drawer.Title>Add Item to Listing</Drawer.Title>
			<Drawer.Description>
				Add an item to the listing. This will be displayed to potential buyers. Select the <span
					class="text-primary">Save</span
				> to add the item to the current listing.
			</Drawer.Description>
		</Drawer.Header>

		<ScrollArea class="h-[350px] rounded-md drop-shadow-lg md:h-[500px]">
			<div class="grid gap-3">
				<div class="flex items-center justify-between rounded-md bg-sidebar p-3">
					<span>{$itemForm.customItemName ? $itemForm.customItemName : 'Select Entity'}</span>
					<EntityLookup
						entity={data.entityRecords!}
						bind:value={$itemForm.entityId}
						bind:name={$itemForm.customItemName}
						bind:type={$itemForm.entityType}
					/>
				</div>

				<div class="flex items-center justify-between rounded-md bg-sidebar p-3">
					<div class="flex flex-col items-start gap-1">
						<Label>Custom</Label>
						<span class="text-sm text-muted-foreground">
							Does this asset have a custom image applied to it or is it a custom item?
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
						<Input bind:value={$itemForm.customImageUrl} />
						<span class="text-sm text-muted-foreground">
							Right now, we do not allow direct uploads. You can upload to Discord and use the link
							here.
						</span>
					</div>

					<div class="flex items-center justify-between rounded-md bg-sidebar p-3">
						<div class="flex flex-col items-start gap-1">
							<Label>Unique Asset</Label>
							<span class="text-sm text-muted-foreground"> This asset is a Unique item. </span>
						</div>
						<Switch bind:checked={$itemForm.uniqueItem} />
					</div>
				{/if}

				<div class="grid gap-1 rounded-md bg-sidebar p-3">
					<Label>Combine ID</Label>
					<Input bind:value={$itemForm.combineId} />
					<span class="text-sm text-muted-foreground">
						We use the Combine ID to track the asset on the holochain. While not required, it is a
						staple of the Unnamed Market. Review our
						<a href="/help#combine-id" target="_blank">help</a> entry for more.
					</span>
				</div>

				<div class="flex items-center justify-between rounded-md bg-sidebar p-3">
					<div class="flex flex-col items-start gap-1">
						<Label>U / U / U</Label>
						<span class="text-sm text-muted-foreground">
							Undocked, Undamaged, Unshielded. These are the conditions of the asset. This is
							informational only.
						</span>
					</div>
					<Switch bind:checked={$itemForm.uuu} />
				</div>
			</div>
		</ScrollArea>

		<Drawer.Footer>
			<Drawer.Close class="text-sm">Cancel</Drawer.Close>
			<form class="w-full" action="?/addItem" method="post" use:itemEnhance>
				<Button class="w-full" variant="default" type="submit">Save</Button>
			</form>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
