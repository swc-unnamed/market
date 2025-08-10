<script lang="ts">
	import AuctionHouseMenu from '$lib/components/common/auction-house/auction-house-menu.svelte';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Database } from '@lucide/svelte';
	import DataTable from './data-table/data-table.svelte';

	let { data } = $props();

	let settings = $derived(data.user.settings);

	const listings = $derived(data.listings);
</script>

<PageWrapper title="Listings" breadcrumb={[{ title: 'Auction House', href: '/auction-house' }]}>
	{#snippet right()}
		<AuctionHouseMenu />
	{/snippet}

	{#if settings.listingViewStyle === 'card'}
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
	{/if}

	{#if settings.listingViewStyle === 'table'}
		<svelte:boundary>
			{#snippet pending()}
				<p>Getting data...</p>
			{/snippet}
			<DataTable />
			<!-- <Card.Root>
				<Card.Content>
				</Card.Content>
			</Card.Root> -->
		</svelte:boundary>
	{/if}
</PageWrapper>
