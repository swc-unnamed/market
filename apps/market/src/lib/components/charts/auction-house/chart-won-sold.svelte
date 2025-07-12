<script lang="ts">
	import { LineChart } from 'layerchart';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import { scaleUtc } from 'd3-scale';
	import {
		curveNatural,
		curveBasis,
		curveStepBefore,
		curveBasisOpen,
		curveBasisClosed,
		curveBundle,
		curveLinear,
		curveMonotoneY,
		curveMonotoneX
	} from 'd3-shape';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	interface Props {
		chartData: {
			date: Date;
			won: number;
			sold: number;
		}[];
	}

	let { chartData }: Props = $props();

	const chartConfig = {
		won: { label: 'won', color: 'var(--chart-1)' },
		sold: { label: 'sold', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Average Income - Last 6 Months</Card.Title>
		<Card.Description>
			Showing the average income from won and sold listings over the last 6 months.
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="h-48 w-full">
			<LineChart
				data={chartData}
				x="date"
				xScale={scaleUtc()}
				axis="x"
				series={[
					{
						key: 'won',
						label: 'Won',
						color: chartConfig.won.color
					},
					{
						key: 'sold',
						label: 'Sold',
						color: chartConfig.sold.color
					}
				]}
				props={{
					spline: { curve: curveMonotoneX, motion: 'tween', strokeWidth: 2 },
					xAxis: {
						format: (v: Date) => v.toLocaleDateString('en-US', { month: 'short' })
					},
					yAxis: {
						format: (v: number) => `${v}m`
					},
					highlight: { points: { r: 4 } }
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel>
						{#snippet formatter(f)}
							<div class="flex w-full justify-between">
								<span>{f.name}</span>
								<span>{f.value}m</span>
							</div>
						{/snippet}
					</Chart.Tooltip>
				{/snippet}
			</LineChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-start gap-2 text-sm">
			<div class="grid gap-2">
				<div class="text-muted-foreground flex items-center gap-2 leading-none">
					All values are in millions of credits
				</div>
			</div>
		</div>
	</Card.Footer>
</Card.Root>
