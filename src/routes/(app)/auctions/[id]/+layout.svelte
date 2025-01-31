<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
	let { children, data } = $props();
	let user = $derived(data.user);
	const sidebar = Sidebar.useSidebar();

	let navTabValue = $state<'available' | 'details' | 'live_auction' | 'modify'>('details');
</script>

<Sidebar.Inset>
	<header
		class="transition=[width,height] ease-linear, z-10 flex h-fit flex-col justify-center gap-2 rounded border border-b-primary bg-background group-has-[[data-collasibile=icon]]/siebar-wrapper:h-fit md:sticky md:top-0 md:py-2"
	>
		<div class="flex w-full items-center justify-between gap-2 px-4 py-2">
			<div class="flex min-w-fit items-center gap-2">
				<Button size="icon" variant="outline" onclick={() => sidebar.toggle()}>
					<Icon icon={sidebar.open ? 'mdi:menu-open' : 'mdi:menu-close'} />
				</Button>
			</div>

			<Tabs.Root bind:value={navTabValue}>
				<Tabs.List>
					<Tabs.Trigger
						value="available"
						onclick={async () => {
							await goto(`/auctions`);
						}}>Avail. Auctions</Tabs.Trigger
					>
					<Tabs.Trigger
						value="details"
						onclick={async () => {
							await goto(`/auctions/${page.params.id}/details`);
						}}>Details</Tabs.Trigger
					>
					{#if AuctioneerPermissionPolicy.includes(user.role)}
						<Tabs.Trigger
							value="modify"
							onclick={async () => {
								await goto(`/auctions/${page.params.id}/modify`);
							}}>Modify Auction</Tabs.Trigger
						>
						<Tabs.Trigger
							value="live_auction"
							onclick={async () => {
								await goto(`/auctions/${page.params.id}/auction`);
							}}>Live Auction</Tabs.Trigger
						>
					{/if}
				</Tabs.List>
			</Tabs.Root>
		</div>
	</header>
	<div class="container">
		<div class="mb-3 mt-3">
			{@render children?.()}
		</div>
	</div>
</Sidebar.Inset>
