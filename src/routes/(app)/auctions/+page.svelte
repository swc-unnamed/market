<script lang="ts">
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
	import { format } from 'date-fns';
	import { SwcTimestamp } from 'swcombine.js';

	let { data } = $props();

	let canCreateAuction = $derived(AuctioneerPermissionPolicy.includes(data.user.role));
</script>

<PageWrapper title="Current Auction Listings">
	<div class="flex flex-col gap-3">
		<Card.Root>
			<Card.Content>
				<div class="flex flex-col gap-1">
					<p>There are currently {data.records.length} auctions available.</p>
				</div>
			</Card.Content>
		</Card.Root>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each data.records as record}
				<Card.Root>
					<Card.Header>
						<Card.Title>{record.title}</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="flex flex-col gap-1">
							<p>Starts: {SwcTimestamp.fromDate(record.startAt).toString()}</p>
							<p class="text-xs text-muted">Start: {format(record.startAt, 'yyyy-MM-dd HH:mm')}</p>
							<p>This auction has {record.listings.length} listings.</p>
						</div>
					</Card.Content>
					<Card.Footer class="flex justify-end">
						<Button variant="link" href={`/auctions/${record.id}`}>View Auction</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</div>
</PageWrapper>
