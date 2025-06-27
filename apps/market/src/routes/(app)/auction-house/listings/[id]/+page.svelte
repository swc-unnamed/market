<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';

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
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Main Listing Info -->
		<div class="lg:col-span-2 flex flex-col gap-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>{listing.title}</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground mb-2">Listing #{listing.listingNumber}</p>
					<p class="mb-4">{listing.description}</p>
					<!-- Listing Details Example (customize as needed) -->
					<div class="mb-4">
						<div class="font-semibold text-yellow-400 mb-1">Description</div>
						<p>{listing.description}</p>
					</div>
					<!-- Add more details as needed -->
				</Card.Content>
			</Card.Root>

			<section class="space-y-4">
				<h2 class="text-lg font-semibold">Items</h2>
				{#if listing.items?.length}
					<div class="overflow-x-auto">
						<table class="min-w-full text-left text-sm">
							<thead>
								<tr class="border-b border-input">
									<th class="p-2 font-semibold">Item</th>
									<th class="p-2 font-semibold">Type</th>
									<th class="p-2 font-semibold">ID</th>
								</tr>
							</thead>
							<tbody>
								{#each listing.items as item}
									<tr class="border-b border-input last:border-0">
										<td class="p-2 flex items-center gap-2">
											{#if item.entity.imageSmall}
												<img src={item.entity.imageSmall} alt={item.entity.name} class="w-10 h-10 rounded object-cover" />
											{/if}
											<span>{item.entity.name}</span>
										</td>
										<td class="p-2">{item.entity.type}</td>
										<td class="p-2 text-xs text-muted-foreground">{item.entity.id}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<p class="text-muted-foreground">No items in this listing.</p>
				{/if}
			</section>
		</div>

		<!-- Sidebar: Seller/About/Actions -->
		<div class="flex flex-col gap-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>About this Seller</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex items-center gap-3 mb-2">
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
					<div class="text-xs text-muted-foreground">Beta Note: Feedback requested. What do you want to see here?</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Actions</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-secondary">Unsubscribe</button>
						<button class="btn btn-primary">Place a Bid</button>
						<button class="btn btn-accent">Buy Now</button>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</PageWrapper>
