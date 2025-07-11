<script lang="ts">
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
	{#snippet navigation()}
		<div class="flex w-full items-center gap-1 rounded-md border p-2">
			<AdminNavTabs />
		</div>
	{/snippet}

	{#snippet right()}
		<Button size="sm" variant="outline" href="/auction-house/admin/live-auctions/create">
			Create Live Auction
		</Button>
		<Button size="sm" variant="destructive" href="/auction-house/dashboard">
			Exit Admin Terminal
		</Button>
	{/snippet}

	<p>Pending</p>
</PageWrapper>
