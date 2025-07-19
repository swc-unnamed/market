<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Database } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { format, formatDistance } from 'date-fns';

	const { data } = $props();

	const auction = $derived(data.auction);
	const listings = $derived(data.auction.listings);
</script>

<PageWrapper
	title={data.auction.title}
	breadcrumb={[
		{ title: 'Auction House', href: '/auction-house' },
		{ title: 'Auctions', href: '/auction-house/auctions' }
	]}
>
	<div class="grid grid-cols-1 gap-3">
		<Card.Root>
			<Card.Header>
				<Card.Title>{auction.title}</Card.Title>
				<Card.Description>
					<div class="flex items-center gap-1">
						<span>{format(new Date(auction.startTime), 'MM/dd/yyy HH:mm')}</span>
						<span>
							{formatDistance(new Date(auction.startTime), new Date(), {
								addSuffix: true
							})}
						</span>
					</div>
				</Card.Description>
			</Card.Header>
			<Card.Content>
				{auction.description}
			</Card.Content>
		</Card.Root>

		<Separator />

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
			{#each listings as listing}
				<Card.Root class="border-2 bg-black">
					<img src={listing.items[0].entity.imageLarge} class="" alt="entity" />
					<Card.Header>
						<div class="flex items-center justify-between">
							<Card.Title class="text-wrap">{listing.title}</Card.Title>
							<Badge variant="outline">{listing.type}</Badge>
						</div>
						<Card.Description>
							Starting at <span class="font-galbasic">$</span>
							{listing.minimumBid.toLocaleString()}
						</Card.Description>
					</Card.Header>

					<Card.Content>
						<ScrollArea class="h-16">
							<div class="grid grid-cols-1 gap-1">
								{#each listing.items as item}
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-1">
											<img
												src={item.customImage ?? item.entity.imageSmall}
												class="size-6"
												alt="small"
											/>
											<p class="text-sm">{item.customName ?? item.entity.name}</p>
										</div>
										<div>
											<a href={`/db/${item.entityId}`}>
												<Database class="hover:text-muted-foreground size-4" />
											</a>
										</div>
									</div>
								{/each}
							</div>
						</ScrollArea>
					</Card.Content>

					<Card.Footer class="flex justify-end">
						<Button variant="secondary" size="sm" href={`/auction-house/listings/${listing.id}`}>
							Details
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</div>
</PageWrapper>
