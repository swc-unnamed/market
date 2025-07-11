<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import AdminTerminalButton from '$lib/components/common/auction-house/admin-terminal-button.svelte';
	import NavigationTabs from '../../../../lib/components/common/auction-house/navtabs.svelte';
</script>

<PageWrapper title="Listings" breadcrumb={[{ title: 'Auction House', href: '/auction-house' }]}>
	{#snippet navigation()}
		<div class="flex w-full items-center gap-1 rounded-md border p-2">
			<NavigationTabs />
		</div>
	{/snippet}

	{#snippet right()}
		<AdminTerminalButton />
	{/snippet}
	<p>Test</p>
</PageWrapper>
