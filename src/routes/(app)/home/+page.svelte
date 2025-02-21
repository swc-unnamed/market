<script lang="ts">
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';

	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import * as Table from '$lib/components/ui/table/index.js';
	import { format } from 'date-fns';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import ListingSummaryCard from '$lib/components/custom/auctions/listing-summary-card.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { SwcTimestamp } from 'swcombine.js';

	let { data } = $props();

	let auctionListings = $derived(data.records);
	let assetLedger = $derived(data.assetLedger);
</script>

<PageWrapper title="Home" displayTitle={false}>
	<div class="mb-4 space-y-4">
		<img class="z-10 w-full rounded-lg" src={'/assets/unnamed-banner.png'} alt="Banner" />

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
					<Tabs.Trigger value="holochain">Holochain Activities</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value="listings">
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						{#if auctionListings.length > 0}
							{#each auctionListings as al (al.id)}
								<ListingSummaryCard listing={al} />
							{/each}
						{/if}
					</div>
				</Tabs.Content>

				<Tabs.Content value="holochain">
					<div class="col-span-2">
						<Card.Root>
							<Card.Header>
								<Card.Title>Recent Holochain Activities</Card.Title>
								<Card.Description>
									TODO: Add a holochain ledger for when an entity is posted, regardless of the type
									of entity or asset
								</Card.Description>
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
												<Table.Cell>{SwcTimestamp.fromDate(al.time).toString()}</Table.Cell>
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
