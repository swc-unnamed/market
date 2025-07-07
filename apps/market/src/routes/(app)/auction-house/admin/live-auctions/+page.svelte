<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import AdminNavTabs from '../../components/admin-navtabs.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Link2 } from '@lucide/svelte';

	const { data } = $props();

	let auctions = $derived(data.auctions);
</script>

<PageWrapper
	title="Live Auctions"
	breadcrumb={[
		{
			title: 'Auction House',
			href: '/auction-house'
		},
		{
			title: 'Admin Terminal',
			href: '/auction-house/admin'
		}
	]}
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

	<div class="grid grid-cols-1 gap-3">
		{#each auctions as auction}
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between ">
					<Card.Title>{auction.title}</Card.Title>
					<div class="flex flex-row items-center gap-2">
						<Avatar.Root>
							<Avatar.Image src={auction.moderator.profile?.avatar} />
						</Avatar.Root>
						{auction.moderator.profile?.displayName}
					</div>
				</Card.Header>
				<Card.Content class="grid grid-cols-1 gap-3">
					<p class="whitespace-pre-wrap">{auction.description}</p>
					<Separator />
					<div class="grid grid-cols-2 gap-3">
						<div class="rounded-md border-2 p-2">Listing Count: {auction._count.listings}</div>
						<div class="rounded-md border-2 p-2">
							Start Time: {auction.startTime.toLocaleDateString()}
							{auction.startTime.toLocaleTimeString()}
						</div>
					</div>
				</Card.Content>
				<Card.Footer>
					<Button variant="secondary" href={`/auction-house/admin/live-auctions/${auction.id}`}>
						<Link2 />
						Details
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</PageWrapper>
