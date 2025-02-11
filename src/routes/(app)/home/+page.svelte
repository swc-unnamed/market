<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import SnackbarActionButton from '$lib/components/custom/layout/snackbar-nav.svelte';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';

	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { formatAuctionListingStatus } from '$lib/helpers/auctions.js';
	import { goto, preloadData } from '$app/navigation';
	import AssetImage from '$lib/components/custom/assets/asset-image.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { integerToCredit } from '$lib/helpers/currency-conversion.js';
	import Icon from '@iconify/svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { format, formatDate } from 'date-fns';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import ListingSummaryCard from '$lib/components/custom/auctions/listing-summary-card.svelte';
	import { Arc, Axis, Canvas, Chart, Group, LinearGradient, Spline, Svg, Text } from 'layerchart';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { source } from 'sveltekit-sse';

	let { data } = $props();
	let api = $state<CarouselAPI>();
	let current = $state(0);
	const count = $derived(api ? api.scrollSnapList().length : 0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	let auctionListings = $derived(data.records);
	let assetLedger = $derived(data.assetLedger);
</script>

<PageWrapper title="Home" displayTitle={false}>
	<div class="mb-4 space-y-4">
		<img class=" w-full rounded-lg" src={'/assets/unnamed-banner.png'} alt="Banner" />

		{#if auctionListings.length < 1}
			<Alert.Root class="border-primary">
				<Alert.Title>No Auction Listings</Alert.Title>
				<Alert.Description>
					You have not created any auction listings yet. <a href="/auctions/listings/new"
						>Create one now!</a
					>
				</Alert.Description>
			</Alert.Root>
		{/if}

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
			<Tabs.Root value="listings" class="col-span-4 ">
				<Tabs.List class="w-full md:w-auto">
					<Tabs.Trigger value="listings">Auction Listings</Tabs.Trigger>
					<Tabs.Trigger value="stats">Stats</Tabs.Trigger>
					<Tabs.Trigger value="holochain">Holochain Activities</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value="listings">
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
						{#if auctionListings.length > 0}
							{#each auctionListings as al (al.id)}
								<ListingSummaryCard listing={al} />
							{/each}
						{/if}
					</div>
				</Tabs.Content>

				<Tabs.Content value="stats">
					<Alert.Root>
						<Alert.Description>
							The stats displayed below are fake and just a placeholder. Once this alert is removed,
							the stats will be live stats.
						</Alert.Description>
					</Alert.Root>
					<div class="grid grid-cols-1 md:grid-cols-2">
						<div class="h-56 w-full rounded p-4">
							<p>Some Random Stat</p>
							<Chart
								data={[
									{ date: new Date(2021, 0, 1), value: 10 },
									{ date: new Date(2021, 0, 2), value: 20 },
									{ date: new Date(2021, 0, 3), value: 14 },
									{ date: new Date(2021, 0, 4), value: 16 },
									{ date: new Date(2021, 0, 5), value: 18 },
									{ date: new Date(2021, 0, 6), value: 60 },
									{ date: new Date(2021, 0, 7), value: 70 }
								]}
								x="date"
								y="value"
								yDomain={[0, null]}
								yNice
								padding={{ left: 16, bottom: 24 }}
							>
								<Svg>
									<Axis
										placement="left"
										grid
										rule
										classes={{
											rule: '',
											tick: '',
											tickLabel: 'fill-foreground font-semibold'
										}}
									/>
									<Axis
										placement="bottom"
										format={(d) => 'Y26 D261'}
										rule
										classes={{
											rule: '',
											tick: '',
											tickLabel: 'fill-foreground font-semibold'
										}}
									/>
									<Spline class="stroke-primary stroke-2" />
								</Svg>
							</Chart>
						</div>
						<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
							<div class="h-56 w-full rounded p-4">
								<p>Your Current Rating</p>
								<Chart>
									<Svg center>
										<Group y={16}>
											<LinearGradient class="from-red-500 to-primary" let:gradient>
												<Arc
													value={78}
													range={[-120, 120]}
													outerRadius={60}
													innerRadius={50}
													cornerRadius={5}
													spring
													let:value
													fill={gradient}
													track={{ class: 'fill-none stroke-foreground/10' }}
												>
													<Text
														value={`${Math.round(value) + '%'} Upvotes`}
														textAnchor="middle"
														verticalAnchor="middle"
														fill="white"
														class="text-sm tabular-nums text-primary"
													/>
												</Arc>
											</LinearGradient>
										</Group>
									</Svg>
								</Chart>
							</div>
						</div>
					</div>
				</Tabs.Content>

				<Tabs.Content value="holochain">
					<div class="col-span-2">
						<Card.Root>
							<Card.Header>
								<Card.Title>Recent Holochain Activities</Card.Title>
							</Card.Header>

							<Card.Content class="text-xs">
								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.Cell>Time</Table.Cell>
											<Table.Cell>Chain ID</Table.Cell>
											<Table.Cell>Activity</Table.Cell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each assetLedger as al (al.id)}
											<Table.Row>
												<Table.Cell>{format(al.time, 'HH:mm')}</Table.Cell>
												<Table.Cell>{al.id}</Table.Cell>
												<Table.Cell>{al.action}</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							</Card.Content>
						</Card.Root>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</PageWrapper>
