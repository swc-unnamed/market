<script lang="ts">
	import { goto } from '$app/navigation';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import * as Table from '$lib/components/ui/table';
	let { data } = $props();
</script>

<PageWrapper title="Draft Auction Listings">
	<p>Review your draft listings. If you want more info here, let us know.</p>

	<Table.Root>
		<Table.Caption>You have {data.records.length} draft Auction Listings</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Cell>ALID</Table.Cell>
				<Table.Cell>Title</Table.Cell>
				<Table.Cell># of Items</Table.Cell>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.records as record}
				<Table.Row
					class="hover:cursor-pointer"
					onclick={async () => {
						await goto(`/auctions/listings/${record.id}/modify`);
					}}
				>
					<Table.Cell class="w-24">{record.listingNumber}</Table.Cell>
					<Table.Cell class="w-48 truncate">{record.title}</Table.Cell>
					<Table.Cell>{record.items.length}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</PageWrapper>
