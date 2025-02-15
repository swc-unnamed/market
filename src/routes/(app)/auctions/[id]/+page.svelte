<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { format } from 'date-fns';
	import ListingSummaryCard from '$lib/components/custom/auctions/listing-summary-card.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';

	let { data } = $props();

	const auction = $derived(data.record);
</script>

<svelte:head>
	<title>{auction.title} | Unnamed Market</title>
</svelte:head>

<PageWrapper title={auction.title}>
	<div class="mb-3 flex w-full flex-col gap-3">
		<Card.Root class="w-full">
			<Card.Content class="flex flex-col items-start justify-between md:flex-row">
				<div class="flex flex-col gap-1">
					<h1>{data.record?.title}</h1>

					<div class="flex flex-row items-center gap-2">
						<h3>Start Time:</h3>
						<p>{format(data.record.startAt, 'yyyy-MM-dd HH:mm')}</p>
					</div>
				</div>

				<Button
					size="sm"
					variant="action"
					onclick={() => {
						navigator.clipboard.writeText(`${data.baseUrl}/p/auctions/${data.record.id}`);
						toast('Link copied!');
					}}
				>
					<Icon icon="tabler:external-link" class="size-8" />
					<span>Copy Public Link</span>
				</Button>
			</Card.Content>
		</Card.Root>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#if data.record.listings.length > 0}
				{#each data.record.listings as al (al.id)}
					<ListingSummaryCard listing={al} />
				{/each}
			{/if}
		</div>
	</div>
</PageWrapper>
