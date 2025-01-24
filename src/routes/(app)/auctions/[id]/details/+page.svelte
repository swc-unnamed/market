<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel';
	import { Badge } from '$lib/components/ui/badge';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import { formatAuctionListingStatus } from '$lib/helpers/auctions';
	import AssetImage from '$lib/components/custom/assets/asset-image.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Icon from '@iconify/svelte';
	import { goto, preloadData } from '$app/navigation';
	import { roleCheck } from '$lib/consts/roles.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { toast } from 'svelte-sonner';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { Label } from '$lib/components/ui/label';
	import { format } from 'date-fns';
	import ListingSummaryCard from '$lib/components/custom/auctions/listing-summary-card.svelte';

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
	const auction = $derived(data.record);
</script>

<LayoutWrapper title={data.record.title} displayTitle={false}>
	{#snippet right()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button size="sm" variant="outline">
					<div class="flex items-center gap-2">
						<Icon icon="mdi:terminal-line" class="size-10" />
						<span class="hidden md:flex">Holoterm</span>
					</div>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content sideOffset={4} alignOffset={-4} class="mr-4">
				<DropdownMenu.Group>
					{#if roleCheck( data.user.role, ['auctioneer', 'magistrate', 'holochain_architect', 'market_tzar'] )}
						<DropdownMenu.Item
							class="group hover:cursor-pointer"
							onclick={async () => await goto(`/auctions/${auction.id}/auction`)}
						>
							<AurebeshText text="LIV" class="w-12 group-hover:text-primary" />
							<span class="group-hover:text-primary">Live Auction</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item
							class="group hover:cursor-pointer"
							onclick={() => {
								navigator.clipboard.writeText(`${data.baseUrl}/p/auctions/${auction.id}`);
								toast('Link copied!');
							}}
						>
							<AurebeshText text="GPL" class="w-12 group-hover:text-primary" />
							<span class="group-hover:text-primary">Get Public Link</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item
							class="group hover:cursor-pointer"
							onmouseenter={async () => {
								await preloadData(`/auctions/${auction.id}/modify`);
							}}
							onclick={async () => await goto(`/auctions/${auction.id}/modify`)}
						>
							<AurebeshText text="MOD" class="w-12 group-hover:text-primary" />
							<span class="group-hover:text-primary">Modify Auction</span>
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}

	<div class="mb-3 flex w-full flex-col gap-3">
		<Card.Root class="w-full">
			<Card.Content>
				<h1>{auction.title}</h1>

				<div class="flex flex-row items-center gap-2">
					<h3>Start Time:</h3>
					<p>{format(auction.startAt, 'yyyy-MM-dd HH:mm')}</p>
				</div>
			</Card.Content>
		</Card.Root>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each auction.listings as listing}
				<ListingSummaryCard {listing} />
				<!-- <Card.Root>
					<Card.Header>
						<Card.Title>
							<div class="flex flex-col gap-2">
								<span class="text-center">{listing.title}</span>
							</div>
						</Card.Title>
					</Card.Header>
					<Card.Content class="flex flex-col gap-2">
						<div class="flex flex-col justify-center">
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
							</Carousel.Root>
						</div>

						<div class="my-3 flex justify-center">
							<Separator class="w-full bg-primary" />
						</div>

						<div class="flex flex-col gap-1">
							<div class="flex flex-row items-center justify-between">
								<span class="text-sm text-primary" style="font-family: 'Galactic Basic'"
									>${integerToCredit(listing.startingPrice)}</span
								>
								<span class="text-sm">U / U / U: Yes</span>
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
								<span class="text-sm">Listed By: {listing.listedBy?.name}</span>
								<span class="text-xs">Rating: 100%</span>
							{/if}
						</div>
						<Button size="sm" variant="link" href={`/auctions/listings/${listing.id}`}>
							<Icon icon="mdi:arrow-right" />
							View Listing
						</Button>
					</Card.Footer>
				</Card.Root> -->
			{/each}
		</div>
	</div>
</LayoutWrapper>
