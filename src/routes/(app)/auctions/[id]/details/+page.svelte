<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { format } from 'date-fns';
	import ListingSummaryCard from '$lib/components/custom/auctions/listing-summary-card.svelte';

	let { data } = $props();

	const auction = $derived(data.record);
</script>

<svelte:head>
	<title>{auction.title} | Unnamed Market</title>
</svelte:head>

<div class="mb-3 flex w-full flex-col gap-3">
	<Card.Root class="w-full">
		<Card.Content>
			<h1>{data.record?.title}</h1>

			<div class="flex flex-row items-center gap-2">
				<h3>Start Time:</h3>
				<p>{format(data.record.startAt, 'yyyy-MM-dd HH:mm')}</p>
			</div>
		</Card.Content>
	</Card.Root>

	<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
		{#if data.record.listings.length > 0}
			{#each data.record.listings as al (al.id)}
				<ListingSummaryCard listing={al} />
			{/each}
		{/if}
	</div>
</div>
