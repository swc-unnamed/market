<script lang="ts">
	import { integerToCredit } from '$lib/helpers/currency-conversion.js';
	import * as Alert from '$lib/components/ui/alert';

	let { data } = $props();

	const auctionEarnings = $derived(
		data.auctions.earnings.map((e) => e.value.startingBid ?? 0).reduce((a, b) => a + b, 0)
	);

	const auctionExpenses = $derived(
		data.auctions.expenses.map((e) => e.value.winningBid ?? 0).reduce((a, b) => a + b, 0)
	);

	const averageEarnings = $derived(
		data.auctions.earnings.map((e) => e.value.startingBid ?? 0).reduce((a, b) => a + b, 0) /
			data.auctions.earnings.length
	);

	$inspect(data.auctions);
</script>

<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
	<Alert.Root class="col-span-3">
		<Alert.Title>Notice</Alert.Title>
		<Alert.Description>
			This page is still under construction. Give us time as we build it out.
		</Alert.Description>
	</Alert.Root>
	<p>
		Auction Earnings: {integerToCredit(auctionEarnings)}
	</p>

	<p>
		Auction Expenses: {integerToCredit(auctionExpenses)}
	</p>

	<p>
		Average Earnings per Auction: {integerToCredit(averageEarnings ? averageEarnings : 0)}
	</p>
</div>
