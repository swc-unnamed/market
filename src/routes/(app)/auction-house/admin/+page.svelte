<script lang="ts">
	import AuctionHouseAdminMenu from '$lib/components/common/auction-house/auction-house-admin-menu.svelte';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import AdminNavTabs from '../../../../lib/components/common/auction-house/admin-navtabs.svelte';

	const { data } = $props();
	const auctions = $derived(data.auctions);
	const pendingListings = $derived(data.pendingListings);
</script>

<PageWrapper
	title="Admin Terminal"
	breadcrumb={[{ title: 'Auction House', href: '/auction-house' }]}
>
	{#snippet right()}
		<AuctionHouseAdminMenu />
	{/snippet}

	<p>Pending</p>
</PageWrapper>
