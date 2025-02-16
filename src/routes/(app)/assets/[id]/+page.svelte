<script lang="ts">
	import AssetImage from '$lib/components/custom/assets/asset-image.svelte';
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import { format } from 'date-fns';

	let { data } = $props();
</script>

<LayoutWrapper title="Asset Ledger">
	<Card.Root>
		<Card.Header>
			<Card.Title>
				Asset: {data.record?.combineId}
			</Card.Title>
			<Card.Description>
				{#if data.record?.customImage}
					<img src={data.record?.customImage} alt="entity_image" />
				{:else if data.record?.entityId}
					<AssetImage id={data.record?.entityId} />
				{/if}
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>
				<span style="font-family: 'Galactic Basic';">We have fou..</span>
				<span>nd the following actions within the holochain.</span>
			</p>

			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Cell class="w-36 uppercase">ID</Table.Cell>
						<Table.Cell class="w-36 uppercase">Time</Table.Cell>
						<Table.Cell class="w-36 uppercase">Action</Table.Cell>
						<Table.Cell class="w-36 uppercase">Value</Table.Cell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if data.record?.ledger}
						{#each data.record?.ledger as ledger}
							<Table.Row>
								<Table.Cell class="w-[50px]">{ledger.id}</Table.Cell>
								<Table.Cell class="w-[50px]">{format(ledger.time, 'yyyy-MM-dd HH:mm')}</Table.Cell>
								<Table.Cell class="w-[50px] uppercase">{ledger.action}</Table.Cell>
								<Table.Cell>{ledger.value}</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</LayoutWrapper>
