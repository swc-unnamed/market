<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import AuctionHouseAdminMenu from '$lib/components/common/auction-house/auction-house-admin-menu.svelte';

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
			title: 'Admin',
			href: '/auction-house/admin'
		}
	]}
>
	{#snippet right()}
		<AuctionHouseAdminMenu />
	{/snippet}

	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<Card.Title>Open Live Auctions</Card.Title>
				<Button href="/auction-house/admin/live-auctions/create" size="sm" variant="outline">
					Create Live Auction
				</Button>
			</div>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Title</Table.Head>
						<Table.Head>Moderator</Table.Head>
						<Table.Head>Start Time</Table.Head>
						<Table.Head># of Listings</Table.Head>
						<Table.Head>Status</Table.Head>
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
							<Table.Cell>{auction.status}</Table.Cell>
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
