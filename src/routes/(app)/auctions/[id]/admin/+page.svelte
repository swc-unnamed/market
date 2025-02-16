<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		Table,
		TableHead,
		TableBody,
		TableRow,
		TableCell,
		TableHeader
	} from '$lib/components/ui/table';
	import { formatAuctionListingStatus } from '$lib/helpers/auctions';
	import { toast } from 'svelte-sonner';
	let { data } = $props();

	$inspect(data.auction?.listings);
</script>

<svelte:head>
	<title>Admin - Auction Listings</title>
</svelte:head>

<div class="grid grid-cols-1 gap-3">
	<Alert>
		<AlertTitle>Instructions</AlertTitle>
		<AlertDescription>
			When the Credits and Assets have been made-over to the respective parties, click the "Mark as
			Complete" button to finalize the Auction Listings.
		</AlertDescription>
	</Alert>

	<div class="grid grid-cols-1 gap-3">
		<Table>
			<TableHeader>
				<TableRow>
					<TableCell>ALID</TableCell>
					<TableCell>Status</TableCell>
					<TableCell>Assets</TableCell>
					<TableCell>Actions</TableCell>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if data.auction?.listings}
					{#each data.auction.listings as listing}
						<TableRow>
							<TableCell>{listing.listingNumber}</TableCell>
							<TableCell>{formatAuctionListingStatus(listing.status)}</TableCell>
							<TableCell>
								<ul>
									{#each listing.items as item}
										<li>{item.entity?.name}</li>
									{/each}
								</ul>
							</TableCell>
							<TableCell>
								{#if listing.status === 'sold'}
									<form
										action="?/complete"
										method="POST"
										use:enhance={() => {
											return async ({ result, update }) => {
												if (result.type == 'success') {
													toast.success('Listing successfully updated');
													await invalidate('auction_admin');
												}
											};
										}}
									>
										<Button type="submit" size="sm" variant="action" name="id" value={listing.id}>
											Mark as Completed
										</Button>
									</form>
								{:else if listing.status === 'completed'}
									<span>Listing Completed</span>
								{:else}
									<span>Invalid Status</span>
								{/if}
							</TableCell>
						</TableRow>
					{/each}
				{/if}
			</TableBody>
		</Table>
	</div>
</div>
