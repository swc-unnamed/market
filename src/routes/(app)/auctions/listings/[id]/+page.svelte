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
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';

	let { data } = $props();

	let listing = $derived(data.listing);
	let isOwnListing = $derived(data.isOwnListing);
</script>

<PageWrapper title={listing.title || 'Auction Listing'}>
	{#snippet center()}
		{#if data.user.role === 'holochain_architect' || data.user.role === 'market_tzar'}
			<Button size="sm" variant="action">Admin Actions</Button>
		{/if}
		{#if isOwnListing}
			<Button size="sm" variant="action" href={`/auctions/listings/${listing.id}/modify`}>
				Modify Listing
			</Button>
		{/if}
	{/snippet}
	<div class="grid grid-cols-1 gap-2">
		<div class="grid grid-cols-1 gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div class="flex items-center justify-between">
							<div>
								Modify: <span class="text-primary">{listing?.title}</span>
							</div>

							<div class="flex gap-2">
								<Badge class="uppercase">{formatAuctionListingStatus(listing.status)}</Badge>
								{#if listing.items.find((i) => i.uniqueItem)}
									<Badge variant="outline" class="uppercase">Unique</Badge>
								{/if}
							</div>
						</div>
					</Card.Title>
					<Card.Description>
						<span>ALID: {listing?.listingNumber}</span>
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="grid grid-cols-1 gap-2">
						{#if listing.listerIsAnon}
							<div class="flex flex-row items-center gap-2">
								<img src={'/assets/uim-animated.gif'} alt="Listed By" class="h-8 w-8 rounded-md" />
								<div class="grid grid-cols-1 gap-0">
									<span class="text-sm">Anonomyous</span>
								</div>
							</div>
						{:else}
							<div class="flex flex-row items-center gap-2">
								<img src={listing.listedBy?.avatar} alt="Listed By" class="h-8 w-8 rounded-md" />
								<div class="grid grid-cols-1 gap-0">
									<span class="text-sm">{listing.listedBy?.name}</span>
								</div>
							</div>
						{/if}
						<div class="flex items-center gap-2">
							<p class="text-accent-foreground">
								Starting Bid:
								{#if listing.startingPrice}
									<span style="font-family: 'Galactic Basic" class="-mr-1 text-primary">$</span>
									{integerToCredit(listing.startingPrice)}
								{:else}
									<span>Not Specified</span>
								{/if}
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
								<Table.Header>
									<Table.Row>
										<Table.Cell>Image</Table.Cell>
										<Table.Cell>Name</Table.Cell>
										<Table.Cell>U / U / U</Table.Cell>
										<Table.Cell>Unique</Table.Cell>
										<Table.Cell>Asset Hash</Table.Cell>
										<Table.Cell></Table.Cell>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each listing?.items as item}
										<Table.Row>
											<Table.Cell class="w-48">
												{#if item.customImageUrl}
													<img
														src={item.customImageUrl}
														alt={item.customItemName}
														class="h-[100px] w-[100px] rounded-md drop-shadow-md"
													/>
												{:else if item.entityId}
													<AssetImage
														class="h-[100px] w-[100px] rounded-md drop-shadow-md"
														id={item.entityId}
													/>
												{/if}
											</Table.Cell>
											<Table.Cell class="w-64">
												{item.customItemName ? item.customItemName : item.entity?.name}
											</Table.Cell>
											<Table.Cell>
												{#if item.uuu}
													<Badge>Yes</Badge>
												{:else}
													No
												{/if}
											</Table.Cell>
											<Table.Cell>
												<span class="uppercase">
													{#if item.uniqueItem}
														<Badge>Yes</Badge>
													{:else}
														No
													{/if}
												</span>
											</Table.Cell>
											<Table.Cell class="w-32 truncate">
												{#if item.assetId}
													{item.assetId}
												{:else}
													N/A
												{/if}
											</Table.Cell>
											<Table.Cell class="w-56">
												{#if item.assetId}
													<Button size="sm" variant="action" href={`/assets/${item.assetId}`}>
														<AurebeshText text="D" />
														Asset Ledger
													</Button>
												{:else}
													Ledger Unavailable
												{/if}
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
</PageWrapper>
