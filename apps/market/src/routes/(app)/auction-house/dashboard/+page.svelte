<script lang="ts">
	import { goto, onNavigate, preloadData } from '$app/navigation';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import ChartWonSold from '$lib/components/charts/auction-house/chart-won-sold.svelte';
	import { gsap } from 'gsap';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import { Badge } from '$lib/components/ui/badge';
	import { SwcTimestamp } from 'swcombine.js';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import AdminTerminalButton from '$lib/components/common/auction-house/admin-terminal-button.svelte';
	import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Menu, Plus, Shield } from '@lucide/svelte';
	import AuctionHouseMenu from '$lib/components/common/auction-house/auction-house-menu.svelte';

	let { data } = $props();

	gsap.registerPlugin(ScrambleTextPlugin);

	const draftListings = $derived(data.drafts);
	const activeListings = $derived(data.active);
	const pastListings = $derived(data.past);

	let tabSelection = $state('active');

	function scrambleText(text: string) {
		return (element: HTMLElement) => {
			const tl = gsap.timeline();

			tl.to(element, {
				duration: 2,
				scrambleText: {
					text,
					speed: 0.4,
					revealDelay: 0.2
				}
			});
		};
	}

	async function getStatData() {
		const response = await fetch('/api/auctions/dashboard/stats', {
			method: 'GET'
		});

		if (!response.ok) {
			throw new Error('Failed to fetch auction stats');
		}

		const data = await response.json();
		return data;
	}
</script>

<PageWrapper
	title="Dashboard"
	breadcrumb={[
		{
			title: 'Auction House',
			href: '/auction-house'
		}
	]}
>
	{#snippet right()}
		<AuctionHouseMenu />
	{/snippet}

	<div class="grid grid-cols-1 gap-3">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
			{#await getStatData()}
				<Skeleton class="h-full w-full" />
				<Skeleton class="h-full w-full" />
			{:then data}
				<Card.Root>
					<Card.Header>
						<Card.Title>
							<div class="flex items-center justify-between">
								<span>Amount Sold</span>
								<span class="font-galbasic">$</span>
							</div>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-center gap-1 text-center text-3xl">
							<span class="font-galbasic">$</span>
							<div
								class="font-bold antialiased"
								{@attach scrambleText(`${data.liveAuctionSold}`)}
							></div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>
							<div class="flex items-center justify-between">
								<span>Amount Won</span>
								<span class="font-galbasic">
									<Icon class="text-green-500" icon="tabler:trophy" />
								</span>
							</div>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-center gap-1 text-center text-3xl">
							<span class="font-galbasic">$</span>
							<div
								class="font-bold antialiased"
								{@attach scrambleText(`${data.liveAuctionWon}`)}
							></div>
						</div>
					</Card.Content>
				</Card.Root>
			{/await}
		</div>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Average Income - Last 6 Months</Card.Title>
				</Card.Header>
				<Card.Content>
					<Alert.Root>
						<Alert.Title>Under Construction</Alert.Title>
						<Alert.Description>
							This feature is currently under construction and will be available soon. We are mainly
							just waiting for data to populate and once it's ready, this will be fully functional.
						</Alert.Description>
					</Alert.Root>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Recent Updates</Card.Title>
					<Card.Description>Recent activity in the auction house.</Card.Description>
				</Card.Header>
				<Card.Content>
					<ScrollArea class="h-[230px]">
						<div class="grid grid-cols-1 gap-1">
							<div class="hover:bg-muted rounded-md border p-2 hover:cursor-pointer">
								<p>Listing #123 has been created</p>
							</div>

							<div class="hover:bg-muted rounded-md border p-2 hover:cursor-pointer">
								<p>Live Auction {SwcTimestamp.now().toString('{y}')}-03 has been scheduled</p>
							</div>

							<div class="hover:bg-muted rounded-md border p-2 hover:cursor-pointer">
								<p>Live Auction {SwcTimestamp.now().toString('{y}')}-04 has been scheduled</p>
							</div>
						</div>
					</ScrollArea>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="grid grid-cols-1">
			<Card.Root>
				<Card.Header>
					<Card.Title>Listing Management</Card.Title>
				</Card.Header>
				<Card.Content>
					<Tabs.Root bind:value={tabSelection} class="w-full">
						<Tabs.List class="w-full">
							<Tabs.Trigger value="drafts">Drafts ({draftListings.length})</Tabs.Trigger>
							<Tabs.Trigger value="active">Active ({activeListings.length})</Tabs.Trigger>
							<Tabs.Trigger value="live_auctions">Live Auctions (0)</Tabs.Trigger>
							<Tabs.Trigger value="past">Past (0)</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="drafts">
							<div class="grid grid-cols-1 gap-3">
								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.Head>Title</Table.Head>
											<Table.Head>Items</Table.Head>
											<Table.Head>Minimum Bid</Table.Head>
											<Table.Head></Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each draftListings as listing, i}
											<Table.Row>
												<Table.Cell>{listing.title}</Table.Cell>
												<Table.Cell>
													<Badge>Items: {listing.items.length}</Badge>
												</Table.Cell>
												<Table.Cell>
													<div>
														<span class="font-galbasic"> $ </span>
														<span>
															{listing.minimumBid.toLocaleString()}
														</span>
													</div>
												</Table.Cell>
												<Table.Cell class="text-right">
													<Button
														variant="outline"
														size="sm"
														href={`/auction-house/listings/${listing.id}/edit`}
													>
														Edit
													</Button>
												</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							</div>
						</Tabs.Content>
						<Tabs.Content value="active">
							<div class="grid grid-cols-1 gap-3">
								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.Head>Title</Table.Head>
											<Table.Head>Items</Table.Head>
											<Table.Head>Minimum Bid</Table.Head>
											<Table.Head></Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each activeListings as listing, i}
											<Table.Row>
												<Table.Cell>{listing.title}</Table.Cell>
												<Table.Cell>
													<Badge>Items: {listing.items.length}</Badge>
												</Table.Cell>
												<Table.Cell>
													<div>
														<span class="font-galbasic"> $ </span>
														<span>
															{listing.minimumBid.toLocaleString()}
														</span>
													</div>
												</Table.Cell>
												<Table.Cell class="text-right">
													<Button
														variant="outline"
														size="sm"
														href={`/auction-house/listings/${listing.id}`}
													>
														View
													</Button>
												</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							</div>
						</Tabs.Content>
						<Tabs.Content value="live_auctions">
							<div class="p-8 text-center">
								<p class="text-muted-foreground">
									There are no planned auctions at this time. Check back later.
								</p>
							</div>
						</Tabs.Content>
						<Tabs.Content value="past">
							<div class="grid grid-cols-1 gap-3">
								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.Head>Title</Table.Head>
											<Table.Head>Items</Table.Head>
											<Table.Head>Closing Bid</Table.Head>
											<Table.Head></Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each pastListings as listing, i}
											<Table.Row>
												<Table.Cell>{listing.title}</Table.Cell>
												<Table.Cell>
													<Badge>Items: {listing.items.length}</Badge>
												</Table.Cell>
												<Table.Cell>
													<div>
														<span class="font-galbasic"> $ </span>
														<span>
															{listing.winningBidAmount?.toLocaleString()}
														</span>
													</div>
												</Table.Cell>
												<Table.Cell class="text-right">
													<Button
														variant="outline"
														size="sm"
														href={`/auction-house/listings/${listing.id}`}
													>
														View
													</Button>
												</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							</div>
						</Tabs.Content>
					</Tabs.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</PageWrapper>
