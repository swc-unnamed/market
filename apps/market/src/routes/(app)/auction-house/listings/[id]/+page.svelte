<script lang="ts">
	import AuctionHouseMenu from '$lib/components/common/auction-house/auction-house-menu.svelte';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';

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
		<p>This page is undergoing a massive re-write.</p>
	</div>
</PageWrapper>
