<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
</script>

<PageWrapper
	title="Auction"
	breadcrumb={[
		{ title: 'Auction House', href: '/auction-house' },
		{ title: 'Auctions', href: '/auction-house/auctions' }
	]}
>
	<p>auction listing</p>
</PageWrapper>
