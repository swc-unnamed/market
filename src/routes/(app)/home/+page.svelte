<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import SnackbarActionButton from '$lib/components/custom/layout/snackbar-action-button.svelte';

	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { formatAuctionListingStatus } from '$lib/helpers/auctions.js';
	import { goto, preloadData } from '$app/navigation';

	let { data } = $props();

	let auctionListings = $derived(data.userListings);

	$inspect(auctionListings);
</script>

<LayoutWrapper title="Home" displayTitle={false}>
	<div class="space-y-4">
		<div class="flex justify-center">
			<img class="w-full rounded-lg" src={'/assets/unnamed-banner.png'} alt="Banner" />
		</div>
		<div class="flex justify-center">
			<p>
				For now, this is just a simple home page. For now we are just showing listings you have
				created. Don't worry, this will update over time.
			</p>
		</div>

		{#if auctionListings.length < 1}
			<Alert.Root class="border-primary">
				<Alert.Title>No Auction Listings</Alert.Title>
				<Alert.Description>
					You have not created any auction listings yet. <a href="/auctions/new">Create one now!</a>
				</Alert.Description>
			</Alert.Root>
		{/if}

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#if auctionListings.length > 0}
				{#each auctionListings as al, i (al.id)}
					<Card.Root
						class="transition-transform duration-150 hover:scale-95 hover:cursor-pointer"
						tabindex={1}
						onmouseenter={async () => {
							await preloadData(`/auctions/${al.id}`);
						}}
						onclick={async () => {
							await goto(`/auctions/${al.id}`);
						}}
					>
						<Card.Header>
							<Card.Title>
								<div class="flex justify-between">
									<span>{al.title}</span>
									{#if al.status}
										<Badge>{formatAuctionListingStatus(al.status)}</Badge>
									{/if}
								</div>
							</Card.Title>
							<Card.Description>
								<span style="font-family: 'Galactic Basic'">$ {al.startingPrice}</span>
							</Card.Description>
						</Card.Header>
						<Card.Content class="flex flex-col gap-2">
							<p class="text-sm">{al.description}</p>
						</Card.Content>
						<Card.Footer>
							<div class="flex justify-between">
								<span class="text-xs"
									>This listing has {al.items.length} item{al.items.length ? '' : 's'}</span
								>
							</div>
						</Card.Footer>
					</Card.Root>
				{/each}
			{/if}
		</div>
	</div>
</LayoutWrapper>
