<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import Icon from '@iconify/svelte';
	import { SwcTimestamp } from 'swcombine.js';
	import { cn } from '$lib/utils.js';

	let { data } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Completed Auctions</Card.Title>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Caption>
				Current CGT: {SwcTimestamp.now().toString('Y{y} D{d} {h}:{m}')}
			</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Title</Table.Head>
					<Table.Head>Start Date</Table.Head>
					<Table.Head>Completed</Table.Head>
					<Table.Head>
						<div class="grid grid-cols-2 gap-1">
							<Tooltip.Root>
								<Tooltip.Trigger>
									<span>
										<Icon
											icon="tabler:circle-dotted-letter-n"
											class="-ml-2 hidden size-6 md:block"
										/>
									</span>
								</Tooltip.Trigger>
								<Tooltip.Content>Number of listings in the Auction.</Tooltip.Content>
							</Tooltip.Root>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<span>
										<Icon
											icon="tabler:circle-dotted-letter-p"
											class="-ml-2 hidden size-6 md:block"
										/>
									</span>
								</Tooltip.Trigger>
								<Tooltip.Content>
									Number of listings that have not been marked Complete.
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
					</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.auctions as auction}
					{@const numListings = auction.listings.length}
					{@const openListings = auction.listings
						.map((x) => x.status !== 'completed')
						.filter((x) => x).length}
					<Table.Row
						class={cn('hover:cursor-pointer', !auction.closed && 'border-l-2 border-l-green-500')}
						onclick={async () => goto(`/auctions/admin/${auction.id}/details`)}
						onmouseenter={async () => preloadData(`/auctions/admin/${auction.id}/details`)}
					>
						<Table.Cell>{auction.title}</Table.Cell>
						<Table.Cell>
							{SwcTimestamp.fromDate(auction.startAt).toString('Y{y} D{d} {h}:{m}')}
						</Table.Cell>
						<Table.Cell>
							{#if auction.completedAt}
								{SwcTimestamp.fromDate(auction.completedAt).toString('Y{y} D{d} {h}:{m}')}
							{:else}
								N/A
							{/if}
						</Table.Cell>
						<Table.Cell>
							<div class="grid grid-cols-2 gap-1">
								<span>{numListings}</span>

								<span class={cn(openListings > 0 && 'text-danger')}>{openListings}</span>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
