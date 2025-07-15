<script lang="ts">
	import AuctionHouseMenu from '$lib/components/common/auction-house/auction-house-menu.svelte';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
</script>

<PageWrapper title="Auctions" breadcrumb={[{ title: 'Auction House', href: '/auction-house' }]}>
	{#snippet right()}
		<AuctionHouseMenu />
	{/snippet}
	<p>Auctions</p>
</PageWrapper>
