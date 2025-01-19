<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import SnackbarActionButton from '$lib/components/custom/layout/snackbar-action-button.svelte';
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

	let auctionListings = $derived(data.userListings);

	$inspect(auctionListings);
</script>

<LayoutWrapper title="Home" displayTitle={false}>
	<div class="space-y-4">
		<div class="flex justify-center">
			<img class="w-full rounded-lg" src={'/assets/unnamed-banner.png'} alt="Banner" />
		</div>
		<div class="flex justify-center">
			<p>
				For now, this is just a simple home page. For now we are just showing listings you have
				created. Don't worry, this will update over time.
			</p>
		</div>

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

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#if auctionListings.length > 0}
				{#each auctionListings as al, i (al.id)}
					<Card.Root>
						<Card.Header>
							<Card.Title>
								<div class="flex justify-between">
									<span>{al.title}</span>
									<div class="flex items-center gap-2">
										{#if al.status}
											<Badge>{formatAuctionListingStatus(al.status)}</Badge>
										{/if}
										<Badge class="bg-green-600 text-foreground">
											<Icon icon="mdi:cloud-check" />
											Assets Verified
										</Badge>
									</div>
								</div>
							</Card.Title>
						</Card.Header>
						<Card.Content class="flex flex-col gap-2">
							<div class="flex flex-col justify-center">
								<Carousel.Root setApi={(emblaApi: any) => (api = emblaApi)}>
									<Carousel.Content class="-ml-2 md:-ml-4">
										{#each al.items as item}
											{#if item.entityId}
												<Carousel.Item>
													<AssetImage id={item.entityId} large />
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
										>${integerToCredit(al.startingPrice)}</span
									>
									<span class="text-sm">U / U / U: Yes</span>
								</div>
								<div class="my-3 flex justify-center">
									<Separator class="full bg-primary" />
								</div>
								<span class="whitespace-pre-wrap text-sm">
									{al.location}
								</span>
							</div>
						</Card.Content>
						<Card.Footer class="flex items-center justify-between">
							<div class="flex flex-col gap-1">
								{#if al.listerIsAnon}
									<span class="text-sm">Listed By: Anon</span>
								{:else}
									<span class="text-sm">Listed By: {al.listedBy?.name}</span>
									<span class="text-xs">Rating: 100%</span>
								{/if}
							</div>
							<Button size="sm" variant="link" href={`/auctions/listings/${al.id}`}>
								<Icon icon="mdi:arrow-right" />
								View Listing
							</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			{/if}
		</div>
	</div>

	<div class="my-4">
		<pre>{JSON.stringify(data.userListings, null, 2)}</pre>
	</div>
</LayoutWrapper>
