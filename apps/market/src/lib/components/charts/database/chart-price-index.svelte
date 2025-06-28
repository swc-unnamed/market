<script lang="ts">
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { scaleUtc } from 'd3-scale';
	import { AreaChart } from 'layerchart';
	import {
		curveBasis,
		curveCardinal,
		curveLinear,
		curveLinearClosed,
		curveNatural,
		curveStep,
		curveStepBefore
	} from 'd3-shape';
	import ChartContainer from '$lib/components/ui/chart/chart-container.svelte';

	const chartData = [
		{ date: new Date('2024-01-01'), auction: 0, marketplace: 0 },
		{ date: new Date('2024-01-02'), auction: 0, marketplace: 0 },
		{ date: new Date('2024-01-03'), auction: 0, marketplace: 0 },
		{ date: new Date('2024-01-04'), auction: 0, marketplace: 0 },
		{ date: new Date('2024-01-05'), auction: 0, marketplace: 0 },
		{ date: new Date('2024-01-06'), auction: 0, marketplace: 0 },
		{ date: new Date('2024-01-07'), auction: 0, marketplace: 0 },
		{ date: new Date('2024-01-08'), auction: 0, marketplace: 100 },
		{ date: new Date('2024-01-09'), auction: 0, marketplace: 120 },
		{ date: new Date('2024-01-10'), auction: 0, marketplace: 150 },
		{ date: new Date('2024-01-11'), auction: 100, marketplace: 200 },
		{ date: new Date('2024-01-12'), auction: 150, marketplace: 180 },
		{ date: new Date('2024-01-13'), auction: 200, marketplace: 220 },
		{ date: new Date('2024-01-14'), auction: 300, marketplace: 250 },
		{ date: new Date('2024-01-15'), auction: 400, marketplace: 300 },
		{ date: new Date('2024-01-16'), auction: 500, marketplace: 350 },
		{ date: new Date('2024-01-17'), auction: 600, marketplace: 400 },
		{ date: new Date('2024-01-18'), auction: 700, marketplace: 450 },
		{ date: new Date('2024-01-19'), auction: 800, marketplace: 500 },
		{ date: new Date('2024-01-20'), auction: 900, marketplace: 550 },
		{ date: new Date('2024-04-01'), auction: 0, marketplace: 150 },
		{ date: new Date('2024-04-02'), auction: 0, marketplace: 180 },
		{ date: new Date('2024-04-03'), auction: 167, marketplace: 0 },
		{ date: new Date('2024-04-04'), auction: 242, marketplace: 0 },
		{ date: new Date('2024-04-05'), auction: 373, marketplace: 0 },
		{ date: new Date('2024-04-06'), auction: 301, marketplace: 0 },
		{ date: new Date('2024-04-07'), auction: 245, marketplace: 180 },
		{ date: new Date('2024-04-08'), auction: 409, marketplace: 320 },
		{ date: new Date('2024-04-09'), auction: 59, marketplace: 110 },
		{ date: new Date('2024-04-10'), auction: 261, marketplace: 190 },
		{ date: new Date('2024-04-11'), auction: 327, marketplace: 350 },
		{ date: new Date('2024-04-12'), auction: 292, marketplace: 210 },
		{ date: new Date('2024-04-13'), auction: 342, marketplace: 380 },
		{ date: new Date('2024-04-14'), auction: 137, marketplace: 220 },
		{ date: new Date('2024-04-15'), auction: 120, marketplace: 170 },
		{ date: new Date('2024-04-16'), auction: 138, marketplace: 190 },
		{ date: new Date('2024-04-17'), auction: 446, marketplace: 360 },
		{ date: new Date('2024-04-18'), auction: 364, marketplace: 410 },
		{ date: new Date('2024-04-19'), auction: 243, marketplace: 180 },
		{ date: new Date('2024-04-20'), auction: 89, marketplace: 150 },
		{ date: new Date('2024-04-21'), auction: 137, marketplace: 200 },
		{ date: new Date('2024-04-22'), auction: 224, marketplace: 0 },
		{ date: new Date('2024-04-23'), auction: 138, marketplace: 230 },
		{ date: new Date('2024-04-24'), auction: 387, marketplace: 290 },
		{ date: new Date('2024-04-25'), auction: 215, marketplace: 250 },
		{ date: new Date('2024-04-26'), auction: 75, marketplace: 130 },
		{ date: new Date('2024-04-27'), auction: 383, marketplace: 420 },
		{ date: new Date('2024-04-28'), auction: 122, marketplace: 180 },
		{ date: new Date('2024-04-29'), auction: 315, marketplace: 240 },
		{ date: new Date('2024-04-30'), auction: 454, marketplace: 380 },
		{ date: new Date('2024-05-01'), auction: 165, marketplace: 220 },
		{ date: new Date('2024-05-02'), auction: 293, marketplace: 310 },
		{ date: new Date('2024-05-03'), auction: 247, marketplace: 190 },
		{ date: new Date('2024-05-04'), auction: 385, marketplace: 420 },
		{ date: new Date('2024-05-05'), auction: 481, marketplace: 390 },
		{ date: new Date('2024-05-06'), auction: 498, marketplace: 520 },
		{ date: new Date('2024-05-07'), auction: 388, marketplace: 300 },
		{ date: new Date('2024-05-08'), auction: 149, marketplace: 210 },
		{ date: new Date('2024-05-09'), auction: 227, marketplace: 180 },
		{ date: new Date('2024-05-10'), auction: 293, marketplace: 330 },
		{ date: new Date('2024-05-11'), auction: 335, marketplace: 270 },
		{ date: new Date('2024-05-12'), auction: 197, marketplace: 240 },
		{ date: new Date('2024-05-13'), auction: 197, marketplace: 160 },
		{ date: new Date('2024-05-14'), auction: 448, marketplace: 490 },
		{ date: new Date('2024-05-15'), auction: 473, marketplace: 380 },
		{ date: new Date('2024-05-16'), auction: 338, marketplace: 400 },
		{ date: new Date('2024-05-17'), auction: 499, marketplace: 420 },
		{ date: new Date('2024-05-18'), auction: 315, marketplace: 350 },
		{ date: new Date('2024-05-19'), auction: 235, marketplace: 180 },
		{ date: new Date('2024-05-20'), auction: 177, marketplace: 230 },
		{ date: new Date('2024-05-21'), auction: 82, marketplace: 140 },
		{ date: new Date('2024-05-22'), auction: 81, marketplace: 120 },
		{ date: new Date('2024-05-23'), auction: 252, marketplace: 290 },
		{ date: new Date('2024-05-24'), auction: 294, marketplace: 220 },
		{ date: new Date('2024-05-25'), auction: 201, marketplace: 250 },
		{ date: new Date('2024-05-26'), auction: 213, marketplace: 170 },
		{ date: new Date('2024-05-27'), auction: 420, marketplace: 460 },
		{ date: new Date('2024-05-28'), auction: 233, marketplace: 190 },
		{ date: new Date('2024-05-29'), auction: 78, marketplace: 130 },
		{ date: new Date('2024-05-30'), auction: 340, marketplace: 280 },
		{ date: new Date('2024-05-31'), auction: 178, marketplace: 230 },
		{ date: new Date('2024-06-01'), auction: 178, marketplace: 200 },
		{ date: new Date('2024-06-02'), auction: 470, marketplace: 410 },
		{ date: new Date('2024-06-03'), auction: 103, marketplace: 160 },
		{ date: new Date('2024-06-04'), auction: 439, marketplace: 380 },
		{ date: new Date('2024-06-05'), auction: 88, marketplace: 140 },
		{ date: new Date('2024-06-06'), auction: 294, marketplace: 250 },
		{ date: new Date('2024-06-07'), auction: 323, marketplace: 370 },
		{ date: new Date('2024-06-08'), auction: 385, marketplace: 320 },
		{ date: new Date('2024-06-09'), auction: 438, marketplace: 480 },
		{ date: new Date('2024-06-10'), auction: 155, marketplace: 200 },
		{ date: new Date('2024-06-11'), auction: 92, marketplace: 150 },
		{ date: new Date('2024-06-12'), auction: 492, marketplace: 420 },
		{ date: new Date('2024-06-13'), auction: 81, marketplace: 130 },
		{ date: new Date('2024-06-14'), auction: 426, marketplace: 380 },
		{ date: new Date('2024-06-15'), auction: 307, marketplace: 350 },
		{ date: new Date('2024-06-16'), auction: 371, marketplace: 310 },
		{ date: new Date('2024-06-17'), auction: 475, marketplace: 520 },
		{ date: new Date('2024-06-18'), auction: 107, marketplace: 170 },
		{ date: new Date('2024-06-19'), auction: 341, marketplace: 290 },
		{ date: new Date('2024-06-20'), auction: 408, marketplace: 450 },
		{ date: new Date('2024-06-21'), auction: 169, marketplace: 210 },
		{ date: new Date('2024-06-22'), auction: 317, marketplace: 270 },
		{ date: new Date('2024-06-23'), auction: 480, marketplace: 530 },
		{ date: new Date('2024-06-24'), auction: 132, marketplace: 180 },
		{ date: new Date('2024-06-25'), auction: 141, marketplace: 190 },
		{ date: new Date('2024-06-26'), auction: 434, marketplace: 380 },
		{ date: new Date('2024-06-27'), auction: 448, marketplace: 490 },
		{ date: new Date('2024-06-28'), auction: 149, marketplace: 200 },
		{ date: new Date('2024-06-29'), auction: 103, marketplace: 160 },
		{ date: new Date('2024-06-30'), auction: 446, marketplace: 400 }
	];

	let timeRange = $state('90d');

	const selectedLabel = $derived.by(() => {
		switch (timeRange) {
			case 'all':
				return 'All time';
			case '1y':
				return 'Last 12 months';
			case '90d':
				return 'Last 3 months';
			case '30d':
				return 'Last 30 days';
			case '7d':
				return 'Last 7 days';
			default:
				return 'Last 3 months';
		}
	});

	const filteredData = $derived(
		chartData.filter((item) => {
			const referenceDate = new Date('2024-06-30');
			let daysToSubtract = 90;
			if (timeRange === '30d') {
				daysToSubtract = 30;
			} else if (timeRange === '7d') {
				daysToSubtract = 7;
			} else if (timeRange === '1y') {
				daysToSubtract = 365;
			} else if (timeRange === 'all') {
				return true; // No filtering for 'all' time
			}

			referenceDate.setDate(referenceDate.getDate() - daysToSubtract);
			return item.date >= referenceDate;
		})
	);

	const chartConfig = {
		auction: { label: 'Auctions', color: 'var(--chart-1)' },
		marketplace: { label: 'Marketplace', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root>
	<Card.Header class="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
		<div class="grid flex-1 gap-1 text-center sm:text-left">
			<Card.Title>Auctions / Marketplace Pricing</Card.Title>
			<Card.Description class="text-xs">
				Auction data may be skewed due to the nature of the data collection.
			</Card.Description>
		</div>
		<Select.Root type="single" bind:value={timeRange}>
			<Select.Trigger class="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
				{selectedLabel}
			</Select.Trigger>
			<Select.Content class="rounded-xl">
				<Select.Item value="all" class="rounded-lg">All time</Select.Item>
				<Select.Item value="1y" class="rounded-lg">Last 12 months</Select.Item>
				<Select.Item value="90d" class="rounded-lg">Last 3 months</Select.Item>
				<Select.Item value="30d" class="rounded-lg">Last 30 days</Select.Item>
				<Select.Item value="7d" class="rounded-lg">Last 7 days</Select.Item>
			</Select.Content>
		</Select.Root>
	</Card.Header>
	<Card.Content>
		<ChartContainer config={chartConfig} class="aspect-auto h-[250px] w-full">
			<AreaChart
				legend
				data={filteredData}
				x="date"
				xScale={scaleUtc()}
				series={[
					{
						key: 'marketplace',
						label: 'Marketplace',
						color: chartConfig.marketplace.color
					},
					{
						key: 'auction',
						label: 'Auctions',
						color: chartConfig.auction.color
					}
				]}
				seriesLayout="stack"
				props={{
					area: {
						curve: curveStepBefore,
						'fill-opacity': 0.4,
						line: { class: 'stroke-1' },
						motion: 'tween'
					},
					xAxis: {
						ticks: timeRange === '7d' ? 7 : undefined,
						format: (v: Date) => {
							return v.toLocaleDateString('en-US', {
								year: '2-digit',
								month: 'short'
							});
						}
					},

					yAxis: { format: () => '' }
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(v: Date) => {
							return v.toLocaleDateString('en-US', {
								month: 'long',
								day: 'numeric',
								year: 'numeric'
							});
						}}
						indicator="line"
					/>
				{/snippet}
			</AreaChart>
		</ChartContainer>
	</Card.Content>
	<Card.Footer>
		<p class="text-muted-foreground text-sm">All values are displayed in the Millions</p>
	</Card.Footer>
</Card.Root>
