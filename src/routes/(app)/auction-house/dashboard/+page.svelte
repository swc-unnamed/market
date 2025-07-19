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
	import type { Notification, Novu } from '@novu/js';
	import { getNovuClient } from '$lib/novu/client/client.js';
	import { format, formatDistance } from 'date-fns';

	let { data } = $props();

	const novu = getNovuClient({
		apiUrl: data.terminal.apiUrl,
		appId: data.terminal.appId,
		socketUrl: data.terminal.socketUrl,
		subscriberId: data.user.id
	});

	gsap.registerPlugin(ScrambleTextPlugin);

	const draftListings = $derived(data.drafts);
	const activeListings = $derived(data.active);
	const pastListings = $derived(data.past);
	const auctions = $derived(data.auctions);

	let notifications = $state<Notification[]>([]);
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

	async function loadActivityFeed() {
		const notificationResult = await novu.notifications.list({
			limit: 10,
			read: false,
			useCache: false,
			tags: ['activity']
		});

		if (!notificationResult) {
			throw new Error('Failed to load activity feed');
		}

		notifications = notificationResult.data?.notifications || [];
	}

	$effect(() => {
		loadActivityFeed();

		novu.on('notifications.notification_received', (e) => {
			if (e.result) {
				notifications = [e.result, ...notifications];
			} else {
				console.error('Notification received event did not contain a result:', e);
			}
		});
	});
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
					<div class="flex items-center justify-between">
						<Card.Title>Feed</Card.Title>
						<Button
							variant="ghost"
							size="sm"
							onclick={async () => {
								await novu.notifications.readAll({
									tags: ['activity']
								});

								notifications = [];

								toast.success('Activity feed cleared');
							}}
						>
							<Icon icon="tabler:clear-all" />
						</Button>
					</div>
					<Card.Description>Your curated activity feed</Card.Description>
				</Card.Header>
				<Card.Content>
					<ScrollArea class="h-[230px]">
						<div class="grid grid-cols-1 gap-2">
							{#each notifications as notif}
								<div class="flex flex-col items-start gap-1 rounded-md border p-2">
									<Badge variant="outline">{notif.subject}</Badge>
									<p>{notif.body}</p>
									<p class="text-muted-foreground text-xs">
										{formatDistance(new Date(notif.createdAt), new Date(), {
											addSuffix: true
										})}
									</p>
								</div>
							{/each}
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
							<Tabs.Trigger value="live_auctions">Live Auctions ({auctions.length})</Tabs.Trigger>
							<Tabs.Trigger value="past">Past ({pastListings.length})</Tabs.Trigger>
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
											<Table.Head>Live Auction</Table.Head>
											<Table.Head>Status</Table.Head>
											<Table.Head>Items</Table.Head>
											<Table.Head>Minimum Bid</Table.Head>
											<Table.Head></Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each activeListings as listing, i}
											<Table.Row>
												<Table.Cell>{listing.title}</Table.Cell>
												<Table.Cell>{listing.liveAuction?.title}</Table.Cell>
												<Table.Cell>{listing.status}</Table.Cell>
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
							<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
								{#each auctions as auction}
									<Card.Root>
										<Card.Header>
											<div class="flex items-center justify-between">
												<Card.Title>{auction.title}</Card.Title>
												<Badge variant="outline">
													{auction.status}
												</Badge>
											</div>
											<div class="flex flex-col">
												<p class="text-muted-foreground text-xs">Moderated by</p>
												<div class="flex items-center gap-2">
													<img
														src={auction.moderator.profile?.avatar}
														alt="mod avatar"
														class="size-6 rounded-md"
													/>
													<span class="text-sm">{auction.moderator.profile?.displayName}</span>
												</div>
											</div>
										</Card.Header>

										<Card.Content>
											<div class="grid grid-cols-1 gap-3">
												<p>Item Count: {auction._count.listings}</p>
												<div class="flex justify-between">
													<p>
														{SwcTimestamp.fromDate(auction.startTime).toString('Y{y} D{d} {h}:{m}')}
													</p>
													<p>{format(auction.startTime, 'MM/dd/yy HH:mm')}</p>
												</div>
											</div>
										</Card.Content>
										<Card.Footer>
											<Button
												variant="outline"
												size="sm"
												href={`/auction-house/auctions/${auction.id}`}
											>
												View Details
											</Button>
										</Card.Footer>
									</Card.Root>
								{/each}
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
