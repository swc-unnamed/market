<script lang="ts">
	import AuctionLedgerDataTable from '$lib/components/account/auction-ledger-data-table.svelte';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';

	let { data } = $props();
	let auctionListings = $derived(data.auctionListings);
	$inspect(data);
</script>

<div class="grid grid-cols-1 gap-3">
	<Alert.Root>
		<Alert.Title>Heads up!</Alert.Title>
		<Alert.Description>
			This is your personal ledger. It shows all of your transactions done on the holochain.
		</Alert.Description>
	</Alert.Root>

	<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
		<div class="col-span-2">
			<AuctionLedgerDataTable />
		</div>
	</div>
</div>
