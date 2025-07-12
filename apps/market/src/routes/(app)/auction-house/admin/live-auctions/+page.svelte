<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import AdminNavTabs from '$lib/components/common/auction-house/admin-navtabs.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
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

	<Card.Root>
		<Card.Header>
			<Card.Title>Open Live Auctions</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Title</Table.Head>
						<Table.Head>Moderator</Table.Head>
						<Table.Head>Start Time</Table.Head>
						<Table.Head># of Listings</Table.Head>
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each auctions as auction}
						<Table.Row>
							<Table.Cell>{auction.title}</Table.Cell>
							<Table.Cell>
								<div class="flex flex-row items-center gap-2">
									<Avatar.Root>
										<Avatar.Image src={auction.moderator.profile?.avatar} />
									</Avatar.Root>
									{auction.moderator.profile?.displayName}
								</div>
							</Table.Cell>
							<Table.Cell>
								{auction.startTime.toLocaleDateString()}
								{auction.startTime.toLocaleTimeString()}
							</Table.Cell>
							<Table.Cell>{auction._count.listings}</Table.Cell>
							<Table.Cell>
								<Button
									variant="secondary"
									size="sm"
									href={`/auction-house/admin/live-auctions/${auction.id}`}
								>
									Details
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</PageWrapper>
