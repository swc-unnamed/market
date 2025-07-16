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
	import { Database } from '@lucide/svelte';

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
					<div class="grid grid-cols-1 gap-3">
						<div>
							<h3>Details</h3>
							<p class="whitespace-pre-wrap">
								{listing.description}
							</p>
						</div>

						<Separator />

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
							<div class="flex items-center justify-between">
								<Card.Title>{item.customName ?? item.name}</Card.Title>
								<Button size="sm" variant="ghost" href={`/db/${item.entityId}`}>
									<Database />
								</Button>
							</div>
							<Card.Description>Entity: {item.entity.name}</Card.Description>
						</Card.Header>
						<Card.Content>
							<img
								src={item.customImage ?? item.entity.imageLarge}
								alt={item.customName ?? item.name}
								class="h-auto w-full rounded-md border-2 drop-shadow-lg"
							/>
							<div class="mt-2 grid grid-cols-3 gap-2">
								<div class="flex flex-col">
									<p class="font-bold">Quantity</p>
									<p>{item.quantity}</p>
								</div>
								<div class="flex flex-col">
									<p class="font-bold">Unique</p>
									<p>{item.unique ? 'Yes' : 'No'}</p>
								</div>
								<div class="flex flex-col">
									<p class="font-bold">UUU</p>
									<p>{item.uuu ? 'Yes' : 'No'}</p>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</div>

		<div class="col-span-1">
			<Card.Root>
				<Card.Content class="flex flex-col gap-3">
					<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
						<Button size="sm" variant="outline" disabled>Subscribe</Button>
						<Button size="sm" variant="outline" disabled>Buy Now</Button>
						<Button size="sm" variant="outline" disabled>Share</Button>
						<p class="text-muted-foreground col-span-3 text-center text-sm">
							These actions are coming soon!
						</p>
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

						{#if listing.liveAuctionId}
							<div class="flex flex-col gap-2">
								<Button href={`/auction-house/auctions/${listing.liveAuctionId}`}>
									View Associated Auction
								</Button>
							</div>
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</PageWrapper>
