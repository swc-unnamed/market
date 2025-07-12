<script lang="ts">
	import AuctionHouseMenu from '$lib/components/common/auction-house/auction-house-menu.svelte';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Database } from '@lucide/svelte';

	let { data } = $props();

	const listings = $derived(data.listings);
</script>

<PageWrapper title="Listings" breadcrumb={[{ title: 'Auction House', href: '/auction-house' }]}>
	{#snippet right()}
		<AuctionHouseMenu />
	{/snippet}

	<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
		{#each listings as listing}
			<Card.Root class="border-2 bg-black">
				<img src={listing.items[0].entity.imageLarge} class="aspect-video" alt="entity" />
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
					<div class="grid grid-cols-1 gap-1">
						{#each listing.items as item}
							<div class="flex items-center justify-between">
								<p class="text-sm">{item.customName ?? item.entity.name}</p>
								<div>
									<Database class="hover:text-muted-foreground size-4" />
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</PageWrapper>
