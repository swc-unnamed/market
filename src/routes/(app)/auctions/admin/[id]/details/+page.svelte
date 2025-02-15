<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { cn } from '$lib/utils.js';
	import { SwcTimestamp } from 'swcombine.js';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { formatAuctionListingStatus } from '$lib/helpers/auctions.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { data } = $props();
	let record = $derived(data.record);
	const editable = $derived(!record.closed);

	const { form, enhance: formEnhance } = superForm(data.form, {
		dataType: 'json',
		onResult: ({ result }) => {
			console.log(result);

			if (result.type === 'failure') {
				toast.error(result.data?.message);
			}

			if (result.type === 'success') {
				toast('Auction updated successfully!');
			}
		}
	});
</script>

<svelte:head>
	<title>{record.title} | Unnamed Market</title>
</svelte:head>

<Card.Root>
	<Card.Header>
		<Card.Title>
			<div class="flex flex-row items-center gap-3 md:justify-between">
				<div class="grid grid-cols-1 gap-1">
					<span class="text-primary">{record.title}</span>
					<span class="text-sm">{SwcTimestamp.fromDate(record.startAt).toString()}</span>
				</div>

				<div class="flex items-center gap-1">
					{#if editable}
						<AlertDialog.Root>
							<AlertDialog.Trigger
								class={cn(buttonVariants({ variant: 'action', size: 'sm' }), 'text-red-500')}
							>
								<AurebeshText text="D" />
								<span>Delete</span>
							</AlertDialog.Trigger>
							<AlertDialog.Content>
								<AlertDialog.Header>
									<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
									<AlertDialog.Description>
										This action cannot be undone. This will permanently delete the auction from the
										holochain. All listings associated with this auction will be returned back to a <span
											class="text-primary">new</span
										> state.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<form method="post" action="?/delete" use:enhance>
										<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
										<AlertDialog.Action type="submit">Delete Auction</AlertDialog.Action>
									</form>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>

						<form method="post" action="?/save" use:formEnhance>
							<Button variant="action" size="sm" type="submit">
								<AurebeshText text="S" />
								<span>Save</span>
							</Button>
						</form>

						<Button variant="action" size="sm" href={`/auctions/admin/${record.id}/live`}>
							<AurebeshText text="LV" />
							<span>Live Auction</span>
						</Button>
					{/if}
				</div>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-3">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="flex flex-col gap-1">
				<Label>Auction Title</Label>
				<Input disabled={!editable} bind:value={$form.title} />
				<p class="text-xs text-muted-foreground">
					We default to the current CGT, but you can change it to whatever you want.
				</p>
			</div>

			<div class="flex flex-col gap-1">
				<Label>Start Time</Label>
				<Input type="datetime-local" disabled={!editable} bind:value={$form.startAt} />
				<p class="text-xs text-muted-foreground">
					Select the time you want to start in your local time zone. We will convert and display it
					in CGT automatically.
				</p>
			</div>
		</div>

		<div class="flex flex-col gap-0">
			<h3>Current Listings</h3>
			<p class="text-sm">These are the current listings that will be available on this Auction.</p>
		</div>

		<div class="flex flex-col gap-2">
			{#each record.listings as listing (listing.id)}
				<div class="space-y-3 rounded-md border p-2">
					<div class="flex flex-row items-center gap-3">
						<Checkbox
							disabled={!editable}
							checked={$form.listings.some((item) => item === listing.id)}
							onCheckedChange={(v) => {
								if (v) {
									$form.listings = [...$form.listings, listing.id];
								} else {
									$form.listings = $form.listings.filter((item) => item !== listing.id);
								}
							}}
						/>
						<div class="flex w-full flex-col items-center gap-3 md:flex-row md:justify-between">
							<div class="flex flex-col">
								<div class="flex items-start gap-1">
									<span class="mb-0">
										{listing.title}
									</span>
									<Badge class="-mt-1 text-xs" variant="secondary">
										{formatAuctionListingStatus(listing.status)}
									</Badge>
								</div>
								<span style="font-family: 'Galactic Basic" class="text-xs">
									${integerToCredit(listing.startingBid ?? 0)}
								</span>
							</div>

							<HoverCard.Root disabled>
								<HoverCard.Trigger class="hover:no-underline">
									<form
										action="?/markListingRecordComplete"
										method="post"
										use:enhance={() => {
											return async ({ result }) => {
												switch (result.type) {
													case 'success':
														toast.success('Listing marked as complete!');
														await invalidate('auction_details');
														break;
													case 'failure':
														toast.error(result.data?.message as string);
														break;
													default:
														toast.error('An error occurred while marking the listing as complete.');
														break;
												}
											};
										}}
									>
										<Button
											type="submit"
											name="listingId"
											value={listing.id}
											disabled={!record.closed || listing.status === 'completed'}
											size="sm"
											variant="action"
											class="hover:no-underline"
										>
											Mark as Complete
										</Button>
									</form>
								</HoverCard.Trigger>
								<HoverCard.Content draggable class="text-xs">
									{#if record.closed}
										Mark this listing as complete. You should only press this once you have sent the
										credits to the seller and the asset to the buyer.
									{:else}
										In order to mark this listing as complete, the auction must be closed.
									{/if}
								</HoverCard.Content>
							</HoverCard.Root>
						</div>
					</div>

					<div class="ml-7 text-sm">
						<div class="flex items-center gap-2">
							<p>Listed By:</p>
							<p
								class={cn(
									listing.anonymousListing &&
										'text-danger blur-sm transition-all duration-300 hover:blur-none'
								)}
							>
								{listing.listedBy?.name}
							</p>
							{#if listing.anonymousListing}
								<HoverCard.Root>
									<HoverCard.Trigger>
										<Icon icon="tabler:info-circle" class="text-primary" />
									</HoverCard.Trigger>
									<HoverCard.Content class="text-xs">
										This user has chosen to remain anonymous.
										<span class="text-danger">Do not reveal their identity to anyone.</span>
										It's listed here in the event you, as the auctioneer, need to contact them for additional
										information.
									</HoverCard.Content>
								</HoverCard.Root>
							{/if}
						</div>
						<div class="flex items-center gap-2">
							<p>Credits To:</p>
							<p>{listing.sendCreditsTo}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if editable}
			<div class="flex flex-col gap-0">
				<h3>Available Listings</h3>
				<p class="text-sm">You can add these listings to the Auction.</p>
			</div>
			<div class="flex flex-col gap-2">
				{#await data.listingRecords}
					<p>Fetching records...</p>
				{:then listingRecords}
					{#each listingRecords as listing, i}
						<div class="flex flex-row items-center gap-3 rounded-md border p-2">
							<Checkbox
								checked={$form.listings.some((item) => item === listing.id)}
								onCheckedChange={(v) => {
									if (v) {
										$form.listings = [...$form.listings, listing.id];
									} else {
										$form.listings = $form.listings.filter((item) => item !== listing.id);
									}
								}}
							/>
							<div class="flex flex-col">
								<span class="-mb-1">{listing.title}</span>
								<span style="font-family: 'Galactic Basic" class="text-xs"
									>${integerToCredit(listing.startingBid ?? 0)}</span
								>
							</div>
						</div>
					{/each}
				{/await}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
