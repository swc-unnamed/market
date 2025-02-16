<script lang="ts">
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { goto } from '$app/navigation';

	let navTabValue = $state('home');
	let { children } = $props();
</script>

<PageWrapper title="Auction Administration">
	{#snippet right()}
		<Tabs.Root class="hidden md:flex" bind:value={navTabValue}>
			<Tabs.List>
				<Tabs.Trigger href="/auctions/admin" value="home">Home</Tabs.Trigger>
				<Tabs.Trigger href="/auctions/admin/new" value="new">New Auction</Tabs.Trigger>
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
				<DropdownMenu.Item onclick={async () => await goto(`/auctions/admin`)}>
					Home
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={async () => await goto(`/auctions/admin/new`)}>
					New Auction
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={async () => await goto(`/auctions/admin/new`)}>
					Completed Auctions
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}

	<section>
		{@render children?.()}
	</section>
</PageWrapper>
