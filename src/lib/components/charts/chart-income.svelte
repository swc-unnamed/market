<script lang="ts">
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { scaleUtc } from 'd3-scale';
	import { BarChart, type ChartContextValue, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';

	const generateDailyData = () => {
		const data = [];
		const endDate = new Date('2025-05-23');
		const startDate = new Date('2024-11-23');

		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			// Randomly generate some zero values (10% chance)
			const shouldBeZero = Math.random() < 0.1;

			data.push({
				date: new Date(d),
				buy: shouldBeZero ? 0 : Math.floor(Math.random() * 900) * 100000,
				sold: shouldBeZero ? 0 : Math.floor(Math.random() * 900) * 100000
			});
		}
		return data;
	};

	const chartData = generateDailyData();

	const chartConfig = {
		views: { label: 'Amount', color: '' },
		buy: { label: 'Purchased', color: 'var(--chart-1)' },
		sold: { label: 'Sold', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
	let context = $state<ChartContextValue>();

	let activeChart = $state<keyof typeof chartConfig>('buy');

	const total = $derived({
		buy: chartData.reduce((acc, curr) => acc + curr.buy, 0),
		sold: chartData.reduce((acc, curr) => acc + curr.sold, 0)
	});

	const activeSeries = $derived([
		{
			key: activeChart,
			label: chartConfig[activeChart].label,
			color: chartConfig[activeChart].color
		}
	]);
</script>

<Card.Root>
	<Card.Header class="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
		<div class="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
			<Card.Title>Income Overview</Card.Title>
			<Card.Description>Showing the last 6 months of income data</Card.Description>
		</div>
		<div class="flex">
			{#each ['buy', 'sold'] as key (key)}
				{@const chart = key as keyof typeof chartConfig}
				<button
					data-active={activeChart === chart}
					class="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
					onclick={() => (activeChart = chart)}
				>
					<span class="text-muted-foreground text-xs">
						{chartConfig[chart].label}
					</span>
					<span class="text-lg leading-none font-bold sm:text-3xl">
						{total[key as keyof typeof total].toLocaleString()}
					</span>
				</button>
			{/each}
		</div>
	</Card.Header>
	<Card.Content class="px-2 sm:p-6">
		<Chart.Container config={chartConfig} class="aspect-auto h-[250px] w-full">
			<BarChart
				bind:context
				data={chartData}
				x="date"
				axis="x"
				series={activeSeries}
				props={{
					bars: {
						stroke: 'none',
						rounded: 'none',
						// use the height of the chart to animate the bars
						initialY: context?.height,
						initialHeight: 0,
						motion: {
							y: { type: 'tween', duration: 500, easing: cubicInOut },
							height: { type: 'tween', duration: 500, easing: cubicInOut }
						}
					},
					highlight: { area: { fill: 'none' } },
					xAxis: {
						format: (d: Date) => {
							return '';
						},
						ticks: (scale) => scaleUtc(scale.domain(), scale.range()).ticks()
					}
				}}
			>
				{#snippet belowMarks()}
					<Highlight area={{ class: 'fill-muted' }} />
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip
						nameKey="views"
						labelFormatter={(v: Date) => {
							return v.toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							});
						}}
					/>
				{/snippet}
			</BarChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-start gap-2 text-sm">
			<div class="grid gap-2">
				<div class="text-muted-foreground flex items-center gap-2 leading-none">
					This is just an example of a chart with example data. We will populate this with real data
					in the future.
				</div>
			</div>
		</div>
	</Card.Footer>
</Card.Root>
