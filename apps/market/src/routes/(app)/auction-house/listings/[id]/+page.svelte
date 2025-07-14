<script lang="ts">
	import AuctionHouseMenu from '$lib/components/common/auction-house/auction-house-menu.svelte';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { getNovuClient } from '$lib/novu/client/client.js';

	let { data } = $props();
	let listing = $derived(data.listing);

	const novu = getNovuClient({
		apiUrl: data.terminal.apiUrl,
		appId: data.terminal.appId,
		socketUrl: data.terminal.socketUrl,
		subscriberId: data.user.id
	});
</script>

<PageWrapper
	title={`#${listing.listingNumber} - ${listing.title}`}
	breadcrumb={[
		{ title: 'Auction House', href: '/auction-house' },
		{ title: 'Listings', href: '/auction-house/listings' }
	]}
>
	{#snippet right()}
		<AuctionHouseMenu />
	{/snippet}

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="col-span-2">
			<Card.Root>
				<Card.Header>
					<div class="flex items-center justify-between">
						<Card.Title class="text-wrap">
							<h2>{listing.title}</h2>
						</Card.Title>
						<Badge variant="outline">{listing.type}</Badge>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
						<div>
							<h3>Details</h3>
							<p class="whitespace-pre-wrap">
								{listing.description}
							</p>
						</div>
						<div>
							<h3>Location</h3>
							<p class="whitespace-pre-wrap">{listing.location}</p>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each listing.items as item (item.id)}
					<Card.Root>
						<Card.Header>
							<Card.Title>{item.name}</Card.Title>
						</Card.Header>
						<Card.Content></Card.Content>
					</Card.Root>
				{/each}
			</div>
		</div>

		<div class="col-span-1">
			<Card.Root>
				<Card.Content class="flex flex-col gap-3">
					<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
						<Button size="sm" variant="outline">Subscribe</Button>
						<Button size="sm" variant="outline" disabled>Buy Now</Button>
						<Button size="sm" variant="outline">Share</Button>
					</div>

					<Separator />

					<div class="grid grid-cols-1 gap-3">
						<div class="flex flex-col gap-2">
							<Label>Minimum Bid</Label>
							<Input value={listing.minimumBid.toLocaleString()} readonly />
						</div>

						<div class="flex flex-col gap-2">
							<Label>Credits Recipient</Label>
							<Input value={listing.creditsRecipient} readonly />
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>

	<!-- <pre>{JSON.stringify(listing, null, 2)}</pre> -->
</PageWrapper>
