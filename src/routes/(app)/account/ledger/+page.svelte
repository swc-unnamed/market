<script lang="ts">
	import { integerToCredit } from '$lib/helpers/currency-conversion.js';
	import { SwcTimestamp } from 'swcombine.js';
	import { format } from 'date-fns';
	import { Arc, Axis, Chart, Group, LinearGradient, Spline, Svg, Text } from 'layerchart';

	let { data } = $props();

	$inspect(data.auctions);
</script>

<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
	<p>
		Auction Earnings: {integerToCredit(
			data.auctions.earnings.map((e) => e.value).reduce((a, b) => a + b, 0)
		)}

		{SwcTimestamp.now().toString()}
	</p>

	<p>
		Auction Expenses: {integerToCredit(
			data.auctions.expenses.map((e) => e.value).reduce((a, b) => a + b, 0)
		)}
	</p>

	<p>
		Average Earnings per Auction: {integerToCredit(
			data.auctions.earnings.map((e) => e.value).reduce((a, b) => a + b, 0) /
				data.auctions.earnings.length
		)}
	</p>
</div>
