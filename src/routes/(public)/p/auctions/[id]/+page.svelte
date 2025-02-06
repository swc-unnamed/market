<script lang="ts">
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Carousel from '$lib/components/ui/carousel';
	import * as Table from '$lib/components/ui/table';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import { Separator } from '$lib/components/ui/separator';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import AssetImage from '$lib/components/custom/assets/asset-image.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import NumberFlow, { NumberFlowGroup } from '@number-flow/svelte';
	import ListingPreviewCard from '$lib/components/custom/auctions/listing-preview-card.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { format } from 'date-fns';
	import { Badge } from '$lib/components/ui/badge/index.js';

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

<div class="flex flex-col items-center justify-center p-4">
	<Card.Root class="container">
		<Card.Header>
			<Card.Title>{record.title}</Card.Title>
			<Card.Description>
				Starts: {format(record.startAt, 'MMMM d, yyyy HH:mm')}
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if secondsUntilStart > 0}
				<div class="mb-3 flex flex-col gap-1">
					<p class="text-xl">Auction starting in</p>
					<NumberFlowGroup>
						<div
							style="font-variant-numeric: tabular-nums; --number-flow-char-height: 0.85em"
							class="~text-3xl/4xl flex items-baseline font-semibold"
						>
							<NumberFlow
								class="text-lg"
								trend={-1}
								value={dd}
								suffix="d"
								format={{ minimumIntegerDigits: 2 }}
							/>
							<NumberFlow
								class="text-lg"
								trend={-1}
								prefix=" "
								value={hh}
								suffix="h"
								format={{ minimumIntegerDigits: 2 }}
							/>
							<NumberFlow
								class="text-lg"
								prefix=" "
								suffix="m"
								trend={-1}
								value={mm}
								digits={{ 1: { max: 5 } }}
								format={{ minimumIntegerDigits: 2 }}
							/>
							<NumberFlow
								class="text-lg"
								prefix=" "
								suffix="s"
								trend={-1}
								value={ss}
								digits={{ 1: { max: 5 } }}
								format={{ minimumIntegerDigits: 2 }}
							/>
						</div>
					</NumberFlowGroup>
				</div>
			{:else}
				<Alert.Root class="mb-3">
					<Alert.Description class="text-center text-2xl text-primary"
						>Auction starting soon!</Alert.Description
					>
				</Alert.Root>
			{/if}

			<div class="grid grid-cols-1 gap-3">
				{#each data.record.listings as listing}
					<Card.Root>
						<Card.Header>
							<Card.Title>{listing.title}</Card.Title>
							<Card.Description class="whitespace-pre-wrap">{listing.description}</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="mb-2 flex flex-col">
								<span class="mr-2">Starting Bid</span>
								<div class="flex items-center gap-1">
									<span>{integerToCredit(listing.startingPrice!)}</span>
									<AurebeshText class="text-primary" text={'$'} />
								</div>
							</div>

							<div class="flex flex-col">
								<h3 class="mr-2">Location</h3>
								<p class="whitespace-pre-wrap">{listing.location}</p>
							</div>

							<Separator class="mb-3 mt-3" />

							<div class="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
								{#each listing.items as item}
									<Card.Root>
										<Card.Header>
											<Card.Title class="flex flex-col text-lg">
												<div class="flex items-center justify-between">
													{#if item.customItemName}
														{item.customItemName}
													{:else}
														{item.entity?.name}
													{/if}
												</div>

												<div class="flex flex-wrap gap-1">
													{#if item.uuu}
														<Badge variant="outline" class="border-blue-500">U / U / U</Badge>
													{/if}
													{#if item.uniqueItem}
														<Badge variant="outline" class="border-blue-500">Unique</Badge>
													{/if}

													<Badge variant="outline" class="border-blue-500">
														QUA: {item.quantity}
													</Badge>
												</div>
											</Card.Title>
										</Card.Header>
										<Card.Content class="">
											{#if item.customImageUrl}
												<img
													src={item.customImageUrl}
													alt={item.customItemName}
													class="h-32 w-full object-cover"
												/>
											{:else if item.entityId}
												<AssetImage
													class="mx-auto h-32 border border-primary"
													large
													id={item.entityId}
												/>
											{/if}
										</Card.Content>
									</Card.Root>
								{/each}
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			<Card.Footer class="mt-3 flex justify-center">
				<p>Want to see more? <a href="/login">Login</a>.</p>
			</Card.Footer>
		</Card.Content>
	</Card.Root>
</div>
