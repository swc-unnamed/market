<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import SnackbarActionButton from '$lib/components/custom/layout/snackbar-action-button.svelte';

	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { formatAuctionListingStatus } from '$lib/helpers/auctions.js';
	import { goto, preloadData } from '$app/navigation';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import AssetImage from '$lib/components/custom/assets/asset-image.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import Icon from '@iconify/svelte';
	import AuctionLedgerIcon from '$lib/components/custom/shared/auction-ledger-icon.svelte';
	import { integerToCredit } from '$lib/helpers/currency-conversion.js';

	let { data } = $props();

	let listing = $derived(data.listing);

	$inspect(listing);
</script>

<LayoutWrapper title={listing.title || 'Auction Listing'}>
	{#snippet center()}
		{#if data.user.role === 'holochain_architect' || data.user.role === 'market_tzar'}
			<Button>Admin Actions</Button>
		{/if}
	{/snippet}
	<div class="grid grid-cols-1 gap-2">
		<div class="grid grid-cols-1 gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div class="flex justify-between">
							<div class="flex flex-col gap-2">
								<span>#{listing.listingNumber} {listing.title}</span>
								{#if listing.listerIsAnon}
									<div class="flex flex-row items-center gap-2">
										<img
											src={'/assets/uim-animated.gif'}
											alt="Listed By"
											class="h-8 w-8 rounded-md"
										/>
										<div class="grid grid-cols-1 gap-0">
											<span class="text-sm">Anonomyous</span>
										</div>
									</div>
								{:else}
									<div class="flex flex-row items-center gap-2">
										<img
											src={listing.listedBy?.avatar}
											alt="Listed By"
											class="h-8 w-8 rounded-md"
										/>
										<div class="grid grid-cols-1 gap-0">
											<span class="text-sm">{listing.listedBy?.name}</span>
										</div>
									</div>
								{/if}
							</div>
							{#if listing.status}
								<div>
									<Badge>{formatAuctionListingStatus(listing.status)}</Badge>
								</div>
							{/if}
						</div>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="grid grid-cols-1 gap-2">
						<div class="flex items-center gap-2">
							<p class="text-accent-foreground">
								Starting Bid:
								<span style="font-family: 'Galactic Basic" class="-mr-1 text-primary">$</span>
								{integerToCredit(listing.startingPrice)}
							</p>

							<Separator orientation="vertical" />

							<p class="text-accent-foreground">
								Send Credits To:
								<span>
									{listing.sendCreditsTo}
								</span>
							</p>
						</div>
						<div class="mb-2 space-y-2">
							<h3>Details</h3>
							<Separator />
							<div class="flex gap-2">
								<Separator orientation="vertical" class="w-1 rounded-md bg-primary" />
								<p class="whitespace-pre-wrap">{listing.description}</p>
							</div>
						</div>

						<div class="mb-2 space-y-2">
							<h3>Location</h3>
							<Separator />
							<div class="flex gap-2">
								<Separator orientation="vertical" class="w-1 rounded-md bg-primary" />
								<p class="whitespace-pre-wrap">{listing.location}</p>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<div>
			<Tabs.Root value="items">
				<Tabs.List>
					<Tabs.Trigger value="items">
						<Icon icon="mdi:package" width="24" height="24" />
						<span class="ml-2">Items</span>
					</Tabs.Trigger>
					<Tabs.Trigger value="ledger">
						<Icon icon="mdi:block-chain" width="24" height="24" />
						<span class="ml-2">Holochain Ledger</span>
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="items">
					<Card.Root>
						<Card.Header>
							<Card.Title>Items</Card.Title>
						</Card.Header>
						<Card.Content>
							<Table.Root>
								<Table.Body>
									{#each listing.items as item, i (item.id)}
										<Table.Row>
											<Table.Cell>
												{#if item.entityId}
													<AssetImage id={item.entityId} />
												{:else}
													<rect class="h-8 w-8 rounded-md bg-primary/35" />
												{/if}
											</Table.Cell>
											<Table.Cell>{item.entity?.name}</Table.Cell>
											<Table.Cell>
												<Button
													class="flex items-center gap-1"
													variant="link"
													href={`/assets/${item.assetId}`}
												>
													<Icon icon="mdi:block-chain" width="24" height="24" />
													<span class="ml-2">View Asset Ledger</span>
												</Button>
											</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				<Tabs.Content value="ledger">
					<div class="grid grid-cols-1 gap-3">
						{#each listing.history as ledger}
							<div class="flex flex-row items-center gap-1 rounded-md bg-sidebar p-3">
								<AuctionLedgerIcon event={ledger.event} />
								<Separator orientation="horizontal" class="w-3 rounded-md bg-primary" />
								<p>{ledger.message}</p>
							</div>
						{/each}
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</LayoutWrapper>
