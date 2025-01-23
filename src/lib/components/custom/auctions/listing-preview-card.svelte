<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { formatAuctionListingStatus } from '$lib/helpers/auctions';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import * as Table from '$lib/components/ui/table';
	import AssetImage from '../assets/asset-image.svelte';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';

	type AuctionListingCardProps = {
		listing: {
			title: string;
			listerIsAnon: boolean;
			startingPrice: string;
			sendCreditsTo: string;
			description: string;
			location: string;
			items: {
				entityId: string;
				entityName: string;
				uuu: boolean;
			}[];
		};
	};

	let { listing = $bindable() }: AuctionListingCardProps = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			<div class="flex justify-between">
				<div class="flex flex-col gap-2">
					<span>{listing.title}</span>
					<span class="text-sm">Listing ID: #0000</span>
				</div>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-2">
			<div class="flex items-start gap-2">
				<p class="text-accent-foreground">
					Starting Bid:
					<span style="font-family: 'Galactic Basic" class="-mr-1 text-primary">$</span>
					{listing.startingPrice}
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

			<Table.Root>
				<Table.Body>
					{#each listing.items as item}
						<Table.Row>
							<Table.Cell>
								{#if item.entityId}
									<AssetImage id={item.entityId} />
								{:else}
									<rect class="h-8 w-8 rounded-md bg-primary/35" />
								{/if}
							</Table.Cell>
							<Table.Cell>{item.entityName}</Table.Cell>
							<Table.Cell>
								{#if item.uuu}
									<Badge class="bg-primary">UUU</Badge>
								{:else}
									<Badge class="bg-blue-600 text-foreground">Not UUU</Badge>
								{/if}
							</Table.Cell>
							<Table.Cell>
								<Button class="flex items-center gap-1" variant="link" disabled>
									<Icon icon="mdi:block-chain" width="24" height="24" />
									<span class="ml-2">View Asset Ledger</span>
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</Card.Content>
</Card.Root>
