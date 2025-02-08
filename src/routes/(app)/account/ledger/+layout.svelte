<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	let { children, data } = $props();
	let user = $derived(data.user);
	const sidebar = Sidebar.useSidebar();

	let navTabValue = $state<'ledger' | 'auctions' | 'marketplace'>('ledger');
</script>

<PageWrapper title="Account Ledger" displayTitle={false}>
	{#snippet right()}
		<Tabs.Root class="hidden md:flex" bind:value={navTabValue}>
			<Tabs.List>
				<Tabs.Trigger
					value="ledger"
					onclick={async () => {
						await goto(`/account/ledger`);
					}}>Ledger</Tabs.Trigger
				>
				<Tabs.Trigger
					value="auctions"
					onclick={async () => {
						await goto(`/account/ledger/auctions`);
					}}>Auction Ledger</Tabs.Trigger
				>
				{#if AuctioneerPermissionPolicy.includes(user.role)}
					<Tabs.Trigger
						disabled
						value="marketplace"
						onclick={async () => {
							await goto(`/account/ledger/marketplace`);
						}}>Marketplace Ledger</Tabs.Trigger
					>
				{/if}
			</Tabs.List>
		</Tabs.Root>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex md:hidden">
				<Button size="sm" variant="outline">
					<div class="flex items-center gap-2">
						<AurebeshText text="T" />
					</div>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content sideOffset={4} alignOffset={-4} class="mr-4">
				<DropdownMenu.Item onclick={async () => await goto(`/account/ledger`)}
					>Ledger</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={async () => {
						await goto(`/account/ledger/auctions`);
					}}>Auction Ledger</DropdownMenu.Item
				>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
	<div class="container">
		<div class="mb-3 mt-3">
			{@render children?.()}
		</div>
	</div>
</PageWrapper>
