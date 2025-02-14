<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import { Separator } from '$lib/components/ui/separator';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import Icon from '@iconify/svelte';
	import AssetImage from '../assets/asset-image.svelte';
	import { formatAuctionListingStatus } from '$lib/helpers/auctions';
	import { Badge } from '$lib/components/ui/badge';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	type ListingSummaryCard = {
		id: string;
		title: string;
		status: string;
		startingPrice?: number | null;
		location?: string | null;
		listerIsAnon?: boolean | null;
		listingNumber: number;
		listedBy?: {
			id: string;
			name: string;
			avatar: string | null;
		} | null;
		items?: {
			entityId: string | null;
			customImageUrl: string | null;
			uniqueItem: boolean | null;
			entity: {
				id: string;
				name: string;
			} | null;
		}[];
	};

	let { listing }: { listing: ListingSummaryCard } = $props();

	let api = $state<CarouselAPI>();
	let current = $state(0);
	const count = $derived(api ? api.scrollSnapList().length : 0);

	let isUniqueItem = $derived(listing.items?.some((item) => item.uniqueItem));

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>
			{listing.title}
		</Card.Title>
	</Card.Header>
	<Card.Content class="-mt-3 flex flex-col gap-2">
		<div class="flex flex-col justify-center">
			{#if listing.items}
				<Carousel.Root setApi={(emblaApi: any) => (api = emblaApi)}>
					<Carousel.Content>
						{#each listing.items as item}
							{#if item.entityId}
								<Carousel.Item class="w-full">
									<span class="ml-1 text-xs text-primary">{item.entity?.name}</span>
									{#if item.customImageUrl}
										<img
											src={item.customImageUrl}
											alt="custom_image"
											class="mx-auto block rounded-md border border-secondary shadow-md drop-shadow-md"
										/>
									{:else}
										<AssetImage
											class="mx-auto block h-64 rounded-md border border-secondary shadow-md drop-shadow-md"
											id={item.entityId}
											large
										/>
									{/if}
								</Carousel.Item>
							{/if}
						{/each}
					</Carousel.Content>
					<div class="flex items-center justify-between">
						<Button
							size="sm"
							class="text-primary"
							variant="link"
							onclick={() => {
								api?.scrollPrev();
							}}
							>Previous
						</Button>

						<span class="text-xs text-muted-foreground">Item {current} of {count}</span>

						<Button
							size="sm"
							class="text-primary"
							variant="link"
							onclick={() => {
								api?.scrollNext();
							}}>Next</Button
						>
					</div>
				</Carousel.Root>
			{/if}
		</div>

		<div class="flex flex-col gap-1">
			<div class="mb-2 flex items-center justify-between rounded-md bg-black p-3">
				<span class="text-sm text-primary" style="font-family: 'Galactic Basic'">
					{#if listing.startingPrice}
						${integerToCredit(listing.startingPrice)}
					{:else}
						$ N/A
					{/if}
				</span>
			</div>

			<span class="text-md font-bold">Location:</span>
			<span class="h-24 overflow-y-auto whitespace-pre-wrap rounded-md text-sm">
				{listing.location}
			</span>

			<div class="flex items-center">
				{#if isUniqueItem}
					<Badge variant="outline" class="bg-sidebar px-4 py-1 text-sm">Unique Item</Badge>
				{/if}
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="flex items-start justify-between">
		<div class="flex flex-col items-start">
			{#if listing.listerIsAnon}
				<span class="text-xs text-muted-foreground">Listed By: Anon</span>
			{:else}
				<span class="text-xs text-muted-foreground">Listed By: {listing.listedBy?.name}</span>
			{/if}
			<span class="text-xs text-muted-foreground">ALID: {listing.listingNumber}</span>
		</div>
		<Button size="sm" variant="link" href={`/auctions/listings/${listing.id}`}>
			<Icon icon="mdi:arrow-right" />
			View Listing
		</Button>
	</Card.Footer>
</Card.Root>
