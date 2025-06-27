<script lang="ts">
	import ChartMaterials from '$lib/components/charts/database/chart-materials.svelte';
	import ChartPriceIndex from '$lib/components/charts/database/chart-price-index.svelte';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import LedgerData from './components/ledger-data.svelte';

	let { data } = $props();
	let entity = $derived(data.entity);

	let combineData = $derived.by(() => {
		if (typeof data.combineData === 'string') {
			return JSON.parse(data.combineData);
		}
		return data.combineData;
	});

	let chartData: { material: string; value: number }[] = $derived.by(() => {
		return combineData.materials.material.map((material: any) => ({
			material: material.value,
			value: Number(material.attributes.quantity)
		}));
	});
</script>

<PageWrapper title={entity.name} breadcrumb={[{ title: 'Database', href: '/db' }]}>
	<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
		<div class="col-span-2">
			<Card.Root>
				<Card.Content>
					<Tabs.Root value="account">
						<Tabs.List class="w-full">
							<Tabs.Trigger value="account">Pricing Index</Tabs.Trigger>
							<Tabs.Trigger value="ledger">Ledgers</Tabs.Trigger>
							<Tabs.Trigger value="misc">Misc.</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="account">
							<ChartPriceIndex />
						</Tabs.Content>
						<Tabs.Content value="ledger">
							<LedgerData />
						</Tabs.Content>
						<Tabs.Content value="misc">
							<ChartMaterials {chartData} />
						</Tabs.Content>
					</Tabs.Root>
				</Card.Content>
			</Card.Root>
		</div>

		<div>
			<Card.Root>
				<Card.Header>
					<Card.Title>{entity.name}</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col items-center gap-3">
					<img src={entity.imageLarge} alt={entity.name} class="h-72 rounded-lg border" />

					{@html combineData.description}
				</Card.Content>
			</Card.Root>
		</div>

		<div></div>
	</div>
</PageWrapper>
