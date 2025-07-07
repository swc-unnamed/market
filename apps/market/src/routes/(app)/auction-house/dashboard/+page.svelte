<script lang="ts">
	import { goto, onNavigate, preloadData } from '$app/navigation';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import NavigationTabs from '../components/navtabs.svelte';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import ChartWonSold from '$lib/components/charts/auction-house/chart-won-sold.svelte';
	import { gsap } from 'gsap';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import { Badge } from '$lib/components/ui/badge';
	import { SwcTimestamp } from 'swcombine.js';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import AdminTerminalButton from '../components/admin-terminal-button.svelte';

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
	{#snippet navigation()}
		<div class="flex w-full items-center gap-1 rounded-md border p-2">
			<NavigationTabs />
		</div>
	{/snippet}

	{#snippet right()}
		<div class="flex items-center gap-2">
			<form
				action="?/createDraft"
				method="post"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type == 'success') {
							toast.success('Draft listing created successfully');
							await goto(`/auction-house/listings/${result.data?.draftId}/edit`);
						}

						if (result.type == 'error') {
							toast.error('Failed to create listing', {
								description: result.error.message
							});
						}
					};
				}}
			>
				<Button size="sm" type="submit" variant="outline">Create Listing</Button>
			</form>

			<AdminTerminalButton />
		</div>
	{/snippet}

	<div class="grid grid-cols-1 gap-3">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
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
					<div class="font-galbasic text-center text-3xl">
						<div class="font-galbasic" {@attach scrambleText('$420.5')}></div>
					</div>
					<div class="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
						<Icon class="text-red-500" icon="tabler:trending-down" />
						<span>-2% from last month</span>
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
					<div class="font-galbasic text-center text-3xl">
						<div class="font-galbasic" {@attach scrambleText('$1.69')}></div>
					</div>
					<div class="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
						<Icon class="text-green-500" icon="tabler:trending-up" />
						<span>+2.6% from last month</span>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Pending Bids</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<div class="font-galbasic flex justify-center gap-2 text-center text-3xl">
						<Icon class="mt-1" icon="tabler:arrows-exchange" />
						<div class="font-galbasic" {@attach scrambleText('0')}></div>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Reputation</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<div class="flex justify-center gap-2 text-center text-3xl">
						<Icon class="mt-1" icon="lucide:stars" />
						<div
							class="font-galbasic"
							{@attach scrambleText(data.user.profile.reputation.toLocaleString())}
						></div>
					</div>
					<div class="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
						<Icon class="text-green-500" icon="tabler:trending-up" />
						<span>+340 from last month</span>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<ChartWonSold />
			<Card.Root>
				<Card.Header>
					<Card.Title>Recent Updates</Card.Title>
					<Card.Description>Recent activity in the auction house.</Card.Description>
				</Card.Header>
				<Card.Content>
					<ScrollArea class="h-[230px]">
						<div class="grid grid-cols-1 gap-1 px-3">
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
