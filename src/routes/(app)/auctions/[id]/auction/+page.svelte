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
	import { invalidate } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog';
	import { format } from 'date-fns';
	import { enhance } from '$app/forms';

	let { data } = $props();
	const record = $derived(data.record);
	let selectedListing = $state<(typeof record.listings)[0] | null>(null);
	let selectedUser = $state<{ id: string; name: string } | undefined>(undefined);
	let selectedListingPurchasePrice = $state<string>('');
	let drawerOpen = $state(false);
	let recordingSale = $state(false);
	let auctionIsCompleted = $derived(record.completedAt ? true : false);

	async function handleListingSale() {
		recordingSale = true;
		const { data } = await axios.post(`/api/auctions/listings/${selectedListing?.id}/record-sale`, {
			purchasedById: selectedUser?.id,
			purchasedPrice: selectedListingPurchasePrice
		});

		if (data.success) {
			drawerOpen = false;
			toast('Sale has been recorded on the holochain.');
			await invalidate('auction:live');
		} else {
			toast('Failed to record sale on the holochain.');
		}
		recordingSale = false;
	}
</script>

<svelte:head>
	<title>{record.title} - Auction | Unnamed Market</title>
</svelte:head>

<div class="flex flex-col gap-3">
	<Card.Root>
		<Card.Content>
			<div class="mb-3 flex items-center justify-between">
				<h1>Live Auction for <span class="text-primary">{record.title}</span></h1>
				<form action="?/end" method="post" use:enhance>
					<Button variant="secondary" disabled={auctionIsCompleted} size="sm" type="submit"
						>End Auction</Button
					>
				</form>
			</div>
			<p class="text-sm">
				{#if record.completedAt}
					Completed At: {format(record.completedAt, 'yyyy-MM-dd HH:mm')}
				{:else}
					To send the listing to discord, press the <span>Send to Discord</span> button. This will
					notify the channel of the current listing being auctioned. To record a sale, press the
					<span>Record Sale</span> button and enter the details of the sale. This will record the
					sale on the holochain. <br /><br />

					Once the Auction is complete, select the 'End Auction' button to end the auction. This
					will end the auction and notify the channel of the auction ending.
				{/if}
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
								disabled={auctionIsCompleted}
								onclick={() => {
									selectedListing = listing;
									drawerOpen = true;
								}}
							>
								Record Sale
							</Button>
							<form
								action="?/sendToDiscord"
								method="post"
								use:enhance={() => {
									return async ({ result }) => {
										if (result.type === 'success') {
											toast('Listing has been sent to Discord.');
										} else {
											toast.error('Failed to send listing to Discord.');
										}
									};
								}}
							>
								<Button
									size="sm"
									variant="action"
									name="listingId"
									value={listing.id}
									disabled={auctionIsCompleted && !data.canSendToDiscord}
									type="submit">Send to Discord</Button
								>
							</form>
						</div>
					</div>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col gap-3">
					<Separator class="bg-primary" />
					<div class="flex flex-col gap-3">
						<div class="flex flex-col gap-0">
							<p>Send Credits To: {listing.sendCreditsTo}</p>
							{#if listing.listedBy}
								<p>Listed By: {listing.listedBy.name}</p>
							{:else}
								<p>Listed By: Anonymous</p>
							{/if}

							<p>
								Starting Bid: <AurebeshText text="$" />
								{integerToCredit(listing.startingPrice!)}
							</p>

							<p>
								Purchased By: {listing.purchasedById ? listing.purchasedBy?.name : 'Not Sold Yet'}
							</p>
							<p>
								Status: {listing.status}
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

<Dialog.Root
	bind:open={drawerOpen}
	onOpenChange={(v) => {
		if (!v) return (selectedListing = null);
	}}
>
	<Dialog.Content class="">
		<Dialog.Header>
			<Dialog.Title>Record Sale of listing #{selectedListing?.listingNumber}</Dialog.Title>
			<Dialog.Description>Record the sale of the listing.</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col gap-3">
			<Label>Who won the bid?</Label>
			<UserSelect users={data.users} bind:selectedUser />
			<CreditInput
				label="Purchased Price"
				min={selectedListing?.startingPrice?.toString()}
				bind:value={selectedListingPurchasePrice}
			/>
		</div>
		<Dialog.Footer class="flex items-center">
			<Dialog.Close>Cancel</Dialog.Close>
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
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
