<script lang="ts">

	import { Arc, Axis, Chart, Group, LinearGradient, Spline, Svg, Text } from 'layerchart';
</script>

<p>
	I have no idea what to show here. To see your Auction Ledger, use the tabs up top.
</p>

<p>
	The idea is to show you a global snapshot and stats of your account. This will be a work in progress.
</p>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
	<div class="h-56 w-full rounded p-4">
		<p>Some Random Stat</p>
		<Chart
			data={[
				{ date: new Date(2021, 0, 1), value: 10 },
				{ date: new Date(2021, 0, 2), value: 20 },
				{ date: new Date(2021, 0, 3), value: 14 },
				{ date: new Date(2021, 0, 4), value: 16 },
				{ date: new Date(2021, 0, 5), value: 18 },
				{ date: new Date(2021, 0, 6), value: 60 },
				{ date: new Date(2021, 0, 7), value: 70 }
			]}
			x="date"
			y="value"
			yDomain={[0, null]}
			yNice
			padding={{ left: 16, bottom: 24 }}
		>
			<Svg>
				<Axis
					placement="left"
					grid
					rule
					classes={{
											rule: '',
											tick: '',
											tickLabel: 'fill-foreground font-semibold'
										}}
				/>
				<Axis
					placement="bottom"
					format={(d) => 'Y26 D261'}
					rule
					classes={{
											rule: '',
											tick: '',
											tickLabel: 'fill-foreground font-semibold'
										}}
				/>
				<Spline class="stroke-primary stroke-2" />
			</Svg>
		</Chart>
	</div>
	<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
		<div class="h-56 w-full rounded p-4">
			<p>Your Current Rating</p>
			<Chart>
				<Svg center>
					<Group y={16}>
						<LinearGradient class="from-red-500 to-primary" let:gradient>
							<Arc
								value={78}
								range={[-120, 120]}
								outerRadius={60}
								innerRadius={50}
								cornerRadius={5}
								spring
								let:value
								fill={gradient}
								track={{ class: 'fill-none stroke-foreground/10' }}
							>
								<Text
									value={`${Math.round(value) + '%'} Upvotes`}
									textAnchor="middle"
									verticalAnchor="middle"
									fill="white"
									class="text-sm tabular-nums text-primary"
								/>
							</Arc>
						</LinearGradient>
					</Group>
				</Svg>
			</Chart>
		</div>
	</div>
	<div class="h-[200px] p-4 overflow-auto">
		<Chart>
			<Svg center>
				<Arc
					value={400}
					domain={[0, 1000]}
					innerRadius={-20}
					cornerRadius={10}
					class="fill-red-500"
					track={{ class: "fill-red-500/10" }}
				/>
				<Arc
					value={20}
					domain={[0, 30]}
					outerRadius={-25}
					innerRadius={-20}
					cornerRadius={10}
					class="fill-lime-400"
					track={{ class: "fill-lime-400/10" }}
				/>
				<Arc
					value={10}
					domain={[0, 12]}
					outerRadius={-50}
					innerRadius={-20}
					cornerRadius={10}
					class="fill-cyan-400"
					track={{ class: "fill-cyan-500/10" }}
				/>
			</Svg>
		</Chart>
		<span>Some random stat</span>
	</div>

</div>