<script lang="ts">
	import AuctionHouseMenu from '$lib/components/common/auction-house/auction-house-menu.svelte';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	let { data } = $props();
	let listing = $derived(data.listing);
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
		<!-- Main Listing Info -->
		<div class="flex flex-col gap-6 lg:col-span-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
							<h3>{listing.title}</h3>
							<div class="md:text-right">
								<Badge variant="secondary">
									ALID #{listing.listingNumber}
								</Badge>
							</div>
						</div>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col justify-evenly gap-3 md:flex-row">
						<div class="w-full p-3">
							<h3 class="text-yellow-500">Details</h3>
							<Separator class="my-2" />
							<div>
								<p class="whitespace-pre-wrap">{listing.description}</p>
							</div>
						</div>

						<div class="w-full p-3">
							<h3 class="text-yellow-500">Location</h3>
							<Separator class="my-2" />
							<div>
								<p class="whitespace-pre-wrap">{listing.location}</p>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Items</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="overflow-x-auto">
						<table class="min-w-full text-left text-sm">
							<thead>
								<tr class="border-input border-b">
									<th class="p-2 font-semibold">Item</th>
									<th class="p-2 font-semibold">Type</th>
									<th class="p-2 font-semibold">UUU</th>
									<th class="p-2 font-semibold"></th>
								</tr>
							</thead>
							<tbody>
								{#each listing.items as item}
									<tr class="border-input border-b last:border-0">
										<td class="flex items-center gap-2 p-2">
											{#if item.entity.imageSmall}
												<img
													src={item.entity.imageSmall}
													alt={item.entity.name}
													class="h-10 w-10 rounded object-cover"
												/>
											{/if}
											{#if item.customImage}
												<img
													src={item.customImage}
													alt={item.entity.name}
													class="h-10 w-10 rounded object-cover"
												/>
											{/if}
											<span>{item.customName ? item.customName : item.entity.name}</span>
										</td>
										<td class="p-2">{item.entity.type}</td>
										<td class="p-2">{item.customImage ? item.customImage : item.entity.name}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Sidebar: Seller/About/Actions -->
		<div class="flex flex-col gap-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>About this Seller</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="mb-2 flex items-center gap-3">
						<Avatar.Root>
							{#if listing.creator?.profile?.avatar}
								<Avatar.Image src={listing.creator.profile.avatar} alt={listing.creator.username} />
							{:else}
								<Avatar.Fallback>{listing.creator?.username?.[0] ?? '?'}</Avatar.Fallback>
							{/if}
						</Avatar.Root>
						<div>
							<div class="font-semibold">{listing.creator?.username}</div>
							<div class="text-xs text-yellow-400">⭐ 50</div>
						</div>
					</div>
					<div class="text-muted-foreground text-xs">
						Beta Note: Feedback requested. What do you want to see here?
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Content>
					<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
						<Button variant="secondary" disabled>Subscribe</Button>
						<Button variant="secondary" disabled>Share</Button>
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger class="w-full">
									<Button class="w-full" disabled variant="secondary">Place a Bid</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>Disabled in current release. Watch for upcoming announcements!</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger class="w-full">
									<Button class="w-full" disabled variant="secondary">Buy Now</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>Disabled in current release. Watch for upcoming announcements!</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</PageWrapper>
