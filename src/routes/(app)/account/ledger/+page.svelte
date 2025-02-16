<script lang="ts">
	import { integerToCredit } from '$lib/helpers/currency-conversion.js';
	import { SwcTimestamp } from 'swcombine.js';

	let { data } = $props();

	$inspect(data.auctions);
</script>

<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
	<p>
		Auction Earnings: {integerToCredit(
			data.auctions.earnings.map((e) => e.value.startingBid ?? 0).reduce((a, b) => a + b, 0)
		)}

		{SwcTimestamp.now().toString()}
	</p>

	<p>
		Auction Expenses: {integerToCredit(
			data.auctions.expenses.map((e) => e.value.winningBid ?? 0).reduce((a, b) => a + b, 0)
		)}
	</p>

	<p>
		Average Earnings per Auction: {integerToCredit(
			data.auctions.earnings.map((e) => e.value.startingBid ?? 0).reduce((a, b) => a + b, 0) /
				data.auctions.earnings.length
		)}
	</p>
</div>
