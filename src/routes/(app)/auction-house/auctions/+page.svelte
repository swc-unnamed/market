<script lang="ts">
	import AuctionHouseMenu from '$lib/components/common/auction-house/auction-house-menu.svelte';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';

	let { data } = $props();
	let auctions = $derived(data.auctions);
</script>

<PageWrapper title="Auctions" breadcrumb={[{ title: 'Auction House', href: '/auction-house' }]}>
	{#snippet right()}
		<AuctionHouseMenu />
	{/snippet}

	{#if data.auctions?.length < 1}
		<Alert.Root>
			<Alert.Description>
				There are no pending Live Auctions at this time. Check back later.
			</Alert.Description>
		</Alert.Root>
	{/if}

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each auctions as auction}
			<Card.Root>
				<Card.Header>
					<Card.Title>{auction.title}</Card.Title>
					<Card.Description>
						<div class="flex flex-col">
							<span>Moderator: {auction.moderator.profile?.displayName}</span>
							<span>Listings: {auction._count.listings}</span>
						</div>
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>{auction.description}</p>
				</Card.Content>
				<Card.Footer class="justify-end">
					<Button href={`/auction-house/auctions/${auction.id}`} size="sm" variant="outline">
						Auction Details
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div></PageWrapper
>
