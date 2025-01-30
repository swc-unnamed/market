<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import { Separator } from '$lib/components/ui/separator';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import Icon from '@iconify/svelte';
	import AssetImage from '../assets/asset-image.svelte';

	type ListingSummaryCard = {
		id: string;
		title: string;
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
		}[];
	};

	let { listing }: { listing: ListingSummaryCard } = $props();

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
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>
			<div class="flex flex-col">
				<span class="truncate">{listing.title}</span>
				<span class="text-sm text-muted-foreground">ALID: {listing.listingNumber}</span>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		<div class="flex flex-col justify-center">
			{#if listing.items}
				<Carousel.Root setApi={(emblaApi: any) => (api = emblaApi)}>
					<Carousel.Content class="-ml-2 h-48 md:-ml-4">
						{#each listing.items as item}
							{#if item.entityId}
								<Carousel.Item>
									<AssetImage
										class="mx-auto h-48 rounded-md border border-secondary shadow-md drop-shadow-md"
										id={item.entityId}
										large
									/>
								</Carousel.Item>
							{/if}
						{/each}
					</Carousel.Content>
					{#if count > 1}
						<div class="py-2 text-center text-sm text-muted-foreground">
							Item {current} of {count}
						</div>
						<div class="flex justify-between">
							<Button
								size="sm"
								class="text-primary"
								variant="ghost"
								onclick={() => {
									api?.scrollPrev();
								}}>Previous Asset</Button
							>
							<Button
								size="sm"
								class="text-primary"
								variant="ghost"
								onclick={() => {
									api?.scrollNext();
								}}>Next Asset</Button
							>
						</div>
					{/if}
				</Carousel.Root>
			{/if}
		</div>

		<div class="my-3 flex justify-center">
			<Separator class="w-full bg-primary" />
		</div>

		<div class="flex flex-col gap-1">
			<div class="flex flex-row items-center justify-between">
				<span class="text-sm text-primary" style="font-family: 'Galactic Basic'">
					{#if listing.startingPrice}
						${integerToCredit(listing.startingPrice)}
					{:else}
						$ N/A
					{/if}
				</span>
			</div>
			<div class="my-3 flex justify-center">
				<Separator class="full bg-primary" />
			</div>
			<span class="text-md font-bold">Location:</span>
			<span
				class="h-24 overflow-y-auto whitespace-pre-wrap rounded-md border border-secondary p-2 text-sm"
			>
				{listing.location}
			</span>
		</div>
		<Separator class="-mb-3 mt-3 w-full bg-primary" />
	</Card.Content>
	<Card.Footer class="flex items-center justify-between">
		<div class="flex flex-col gap-1">
			{#if listing.listerIsAnon}
				<span class="text-sm">Listed By: Anon</span>
			{:else}
				<span class="text-sm">Listed By:</span>
				<span class="text-xs">{listing.listedBy?.name}</span>
			{/if}
		</div>
		<Button size="sm" variant="link" href={`/auctions/listings/${listing.id}`}>
			<Icon icon="mdi:arrow-right" />
			View Listing
		</Button>
	</Card.Footer>
</Card.Root>
