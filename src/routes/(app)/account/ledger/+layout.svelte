<script lang="ts">
	import { goto } from '$app/navigation';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	let { children } = $props();
</script>

<PageWrapper title="Account Ledger">
	{#snippet right()}
		<Tabs.Root value="main">
			<Tabs.List>
				<Tabs.Trigger value="main" onclick={async () => await goto('/account/ledger')}>
					Overview
				</Tabs.Trigger>
				<Tabs.Trigger value="auction" onclick={async () => await goto('/account/ledger/auctions')}>
					Auction Ledger
				</Tabs.Trigger>
				<Tabs.Trigger
					value="marketplace"
					onclick={async () => await goto('/account/ledger/market')}
				>
					Market Ledger
				</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	{/snippet}

	<div class="container">
		{@render children?.()}
	</div>
</PageWrapper>
