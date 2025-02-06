<script lang="ts">
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import { Separator } from '$lib/components/ui/separator';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import * as Table from '$lib/components/ui/table';
	import AssetImage from '$lib/components/custom/assets/asset-image.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import NumberFlow, { NumberFlowGroup } from '@number-flow/svelte';
	import ListingPreviewCard from '$lib/components/custom/auctions/listing-preview-card.svelte';

	let { data } = $props();
	const record = $derived(data.record);

	let api = $state<CarouselAPI>();
	let current = $state(0);
	const count = $derived(api ? api.scrollSnapList().length : 0);

	let secondsUntilStart = $state(
		Math.floor((new Date(record.startAt).getTime() - Date.now()) / 1000)
	);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	$effect(() => {
		const interval = setInterval(() => {
			secondsUntilStart = secondsUntilStart - 1;
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	const dd = $derived(Math.floor(secondsUntilStart / 86400));

	// calculate hours based on a 24 hour day but only show 0-23

	const hh = $derived(Math.floor(secondsUntilStart / 3600) % 24);
	const mm = $derived(Math.floor((secondsUntilStart % 3600) / 60));
	const ss = $derived(secondsUntilStart % 60);
</script>

<svelte:head>
	<title>{record.title} | Unnamed Market</title>
	<meta
		property="og:description"
		content={`Unnamed Imperium Market - Your gateway to the holochain. This auction has ${record.listings.length} listings.`}
	/>
</svelte:head>

<div class="flex h-screen flex-col items-center justify-center border p-4">
	<Card.Root class="container h-full">
		<Card.Header>
			<Card.Title>{record.title}</Card.Title>
			<Card.Description>
				Starts: {record.startAt}
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if secondsUntilStart > 0}
				<div class="flex items-center gap-1">
					<p class="text-center">Auction starts in:</p>
					<NumberFlowGroup>
						<div
							style="font-variant-numeric: tabular-nums; --number-flow-char-height: 0.85em"
							class="~text-3xl/4xl flex items-baseline font-semibold"
						>
							<NumberFlow trend={-1} value={dd} format={{ minimumIntegerDigits: 2 }} />
							<NumberFlow trend={-1} prefix=":" value={hh} format={{ minimumIntegerDigits: 2 }} />
							<NumberFlow
								prefix=":"
								trend={-1}
								value={mm}
								digits={{ 1: { max: 5 } }}
								format={{ minimumIntegerDigits: 2 }}
							/>
							<NumberFlow
								prefix=":"
								trend={-1}
								value={ss}
								digits={{ 1: { max: 5 } }}
								format={{ minimumIntegerDigits: 2 }}
							/>
						</div>
					</NumberFlowGroup>
				</div>
			{:else}
				<p class="text-center">Auction starting soon!</p>
			{/if}

			<Separator class="mb-3 bg-primary" />
			<Carousel.Root setApi={(emblaApi: any) => (api = emblaApi)}>
				<Carousel.Content>
					{#each record.listings as listing}
						<Carousel.Item>
							<div class="flex w-full justify-center">
								<Card.Root class="w-full md:w-1/2 lg:w-2/3">
									<Card.Header>
										<Card.Title>#{listing.listingNumber} {listing.title}</Card.Title>
										<Card.Description>
											<span>Starting Bid</span>
											<div class="flex items-center">
												<AurebeshText text={'$'} />
												{#if listing.startingPrice}
													<span>{integerToCredit(listing.startingPrice)}</span>
												{/if}
											</div>
										</Card.Description>
									</Card.Header>
									<Card.Content class="space-y-3">
										<Separator class="bg-primary" />

										<div class="flex flex-col gap-0">
											<p class="font-bold">Description</p>
											<p class="whitespace-pre-wrap">{listing.description}</p>
										</div>

										<div class="flex flex-col gap-0">
											<p class="font-bold">Location</p>
											<p class="whitespace-pre-wrap">{listing.location}</p>
										</div>

										<Separator class="bg-primary" />
										<p class="font-bold">Listed Assets</p>
										<Table.Root>
											<Table.Header>
												<Table.Row>
													<Table.Cell></Table.Cell>
													<Table.Cell>Asset</Table.Cell>
													<Table.Cell>U / U / U</Table.Cell>
												</Table.Row>
											</Table.Header>
											<Table.Body>
												<Table.Row>
													{#each listing.items as item}
														<Table.Cell>
															{#if item.customImageUrl}
																<img
																	src={item.customImageUrl}
																	alt="custom_image"
																	class="h-16 w-16"
																/>
															{:else if item.asset?.customImageUrl}
																<img
																	src={item.asset?.customImageUrl}
																	alt="custom_image"
																	class="h-16 w-16"
																/>
															{:else if item.entityId}
																<AssetImage id={item.entityId} class="h-16 w-16" />
															{:else}
																<img
																	src="/assets/uim-animated.gif"
																	class="h-16 w-16"
																	alt="animated_gif"
																/>
															{/if}
														</Table.Cell>
														<Table.Cell>
															{item.entity?.name}
														</Table.Cell>
														<Table.Cell>
															{#if item.uuu}
																Yes
															{:else}
																No
															{/if}
														</Table.Cell>
													{/each}
												</Table.Row>
											</Table.Body>
										</Table.Root>
									</Card.Content>
								</Card.Root>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<div class="w-full">
					<div class="flex flex-col items-center justify-center">
						<div class="py-2 text-center text-sm text-muted-foreground">
							Listing {current} of {count}
						</div>
						<div class="flex justify-between">
							<Button
								size="sm"
								class="text-primary"
								variant="ghost"
								onclick={() => {
									api?.scrollPrev();
								}}>Previous Listing</Button
							>
							<Button
								size="sm"
								class="text-primary"
								variant="ghost"
								onclick={() => {
									api?.scrollNext();
								}}>Next Listing</Button
							>
						</div>
					</div>
				</div>
			</Carousel.Root>

			{#each data.record.listings as listing}
				<ListingPreviewCard {listing} />
			{/each}

			<Card.Footer class="mt-3 flex justify-center">
				<p>Want to see more? <a href="/login">Login</a>.</p>
			</Card.Footer>
		</Card.Content>
	</Card.Root>
</div>
