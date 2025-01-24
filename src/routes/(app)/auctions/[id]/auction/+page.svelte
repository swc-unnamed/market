<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import * as Table from '$lib/components/ui/table';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import CreditInput from '$lib/components/custom/inputs/credit-input.svelte';
	import UserSelect from '$lib/components/custom/shared/user-select.svelte';
	import axios from 'axios';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	const record = $derived(data.record);
	let selectedListing = $state<(typeof record.listings)[0] | null>(null);
	let selectedUser = $state<{ id: string; name: string } | undefined>(undefined);
	let selectedListingPurchasePrice = $state<string>('');
	let drawerOpen = $state(false);
	let recordingSale = $state(false);

	async function handleListingSale() {
		recordingSale = true;
		const { data } = await axios.post(`/api/auctions/listings/${selectedListing?.id}/record-sale`, {
			purchasedById: selectedUser?.id,
			purchasedPrice: selectedListingPurchasePrice
		});

		if (data.success) {
			toast('Sale has been recorded on the holochain.');
		} else {
			toast('Failed to record sale on the holochain.');
		}
		recordingSale = false;
	}
</script>

<LayoutWrapper title="Live Auction" displayTitle={false}>
	<div class="flex flex-col gap-3">
		<Card.Root>
			<Card.Content>
				<h1>Live Auction for <span class="text-primary">{record.title}</span></h1>
				<p>
					To send the listing to discord, press the <span>Send to Discord</span> button. This will notify
					the channel of the current listing being auctioned.
				</p>
			</Card.Content>
		</Card.Root>

		{#each record.listings as listing}
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div class="flex items-center justify-between">
							<span>#{listing.listingNumber} {listing.title}</span>

							<div class="flex items-center gap-3">
								<Button
									size="sm"
									variant="link"
									class="border-primary"
									onclick={() => {
										selectedListing = listing;
										drawerOpen = true;
									}}
								>
									Record Sale
								</Button>
								<Button
									size="sm"
									variant="ghost"
									class="border-primary"
									onclick={() => alert('Not Yet Implemented')}>Send to Discord</Button
								>
							</div>
						</div>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col gap-3">
						<Separator class="bg-primary" />
						<div class="flex flex-col gap-3">
							<div class="grid grid-cols-3 gap-3">
								<p>Send Credits To: {listing.sendCreditsTo}</p>
								{#if listing.listedBy}
									<p>Listed By: {listing.listedBy.name}</p>
								{:else}
									<p>Listed By: Anonymous</p>
								{/if}

								<p>
									Starting Bid: <AurebeshText text="$" />
									{integerToCredit(listing.startingPrice)}
								</p>
							</div>
							<Separator />

							<div class="flex flex-col">
								<p>Description</p>
								<p class="whitespace-pre-wrap">{listing.description}</p>
							</div>

							<Separator />

							<div class="flex flex-col">
								<p>Location</p>
								<p class="whitespace-pre-wrap">{listing.location}</p>
							</div>

							<div class="flex flex-col">
								<p>Assets</p>
								<Table.Root>
									<Table.Body>
										{#each listing.items as item}
											<Table.Row>
												<Table.Cell>{item.entity?.name}</Table.Cell>
												<Table.Cell>{item.entity?.type}</Table.Cell>
												<Table.Cell>{item.uuu ? 'UUU: Yes' : 'UUU: No'}</Table.Cell>
												<Table.Cell>
													<a href={`/assets/${item.assetId}`}>View Asset Ledger</a>
												</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<Drawer.Root
		bind:open={drawerOpen}
		onClose={() => {
			selectedListing = null;
		}}
	>
		<Drawer.Content class="mx-auto h-1/2 w-full md:w-1/3">
			<Drawer.Header>
				<Drawer.Title>Record Sale of listing #{selectedListing?.listingNumber}</Drawer.Title>
				<Drawer.Description>Record the sale of the listing.</Drawer.Description>
			</Drawer.Header>
			<div class="flex flex-col gap-3 p-4">
				<Label>Who won the bid?</Label>
				<UserSelect users={data.users} bind:selectedUser />
				<CreditInput label="Purchased Price" bind:value={selectedListingPurchasePrice} />
			</div>
			<Drawer.Footer>
				<Button
					disabled={recordingSale}
					onclick={async () => {
						await handleListingSale();
					}}
				>
					{#if recordingSale}
						Recording Sale...
					{:else}
						Record Sale
					{/if}
				</Button>
				<Drawer.Close>Cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
</LayoutWrapper>
