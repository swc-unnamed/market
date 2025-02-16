<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import NumberFlow, { NumberFlowGroup } from '@number-flow/svelte';
	import { format } from 'date-fns';
	import ListingSummaryCard from '$lib/components/custom/auctions/listing-summary-card.svelte';

	let { data } = $props();
	const record = $derived(data.record);

	let api = $state<CarouselAPI>();
	let current = $state(0);

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
	<div
		style="mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0) 90%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, 0) 90%);
  "
		class="absolute inset-0 z-0 bg-[url('/images/login/banner-1.png')] bg-cover bg-center opacity-25"
	></div>
	<div class="z-10 flex w-full items-center pl-12">
		<img src="/assets/uim-17.png" class="size-12" alt="logo" />
		<h1 class="ml-2 text-left text-3xl">Unnamed Market</h1>
	</div>
	<Card.Root class="z-10 border-none bg-transparent">
		<Card.Header>
			<Card.Title>
				<div class="flex flex-col justify-between md:flex-row">
					<span class="text-3xl">Live Auction - {record.title}</span>

					{#if secondsUntilStart > 0}
						<div class="flex flex-col">
							<div>
								<span class="text-md">Auction Starts in</span>
								<NumberFlowGroup>
									<NumberFlow
										class="text-md"
										trend={-1}
										value={dd}
										suffix="d"
										format={{ minimumIntegerDigits: 2 }}
									/>
									<NumberFlow
										class="text-md"
										trend={-1}
										prefix=" "
										value={hh}
										suffix="h"
										format={{ minimumIntegerDigits: 2 }}
									/>
									<NumberFlow
										class="text-md"
										prefix=" "
										suffix="m"
										trend={-1}
										value={mm}
										digits={{ 1: { max: 5 } }}
										format={{ minimumIntegerDigits: 2 }}
									/>
									<NumberFlow
										class="text-md"
										prefix=" "
										suffix="s"
										trend={-1}
										value={ss}
										digits={{ 1: { max: 5 } }}
										format={{ minimumIntegerDigits: 2 }}
									/>
								</NumberFlowGroup>
							</div>

							<span class="text-sm text-muted-foreground"
								>Starts: {format(data.record.startAt, 'MMMM d, yyyy HH:mm')}</span
							>
						</div>
					{/if}
				</div>
			</Card.Title>
			<!-- <Card.Description>
				Starts: {format(record.startAt, 'MMMM d, yyyy HH:mm')}
			</Card.Description> -->
		</Card.Header>
		<Card.Content>
			{#if secondsUntilStart < 1}
				<Alert.Root class="mb-3">
					<Alert.Description class="text-center text-2xl text-primary"
						>Auction starting soon!</Alert.Description
					>
				</Alert.Root>
			{/if}

			<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				{#each data.record.listings as listing}
					<ListingSummaryCard {listing} />
				{/each}
			</div>

			<Card.Footer class="mt-3 flex justify-center">
				<p>Want to see more? <a href="/login">Login</a>.</p>
			</Card.Footer>
		</Card.Content>
	</Card.Root>
</div>
