<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { SwcTimestamp } from 'swcombine.js';
	import { createId } from '@paralleldrive/cuid2';
</script>

<div class="grid grid-cols-1">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Hash</Table.Head>
				<Table.Head>Timestamp</Table.Head>
				<Table.Head>Type</Table.Head>
				<Table.Head>Value</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each Array(30) as _, index}
				<Table.Row>
					<Table.Cell class="text-sm">{createId()}</Table.Cell>
					<Table.Cell class="text-sm">Auction</Table.Cell>
					<Table.Cell>
						<div class="flex flex-col">
							<span>{SwcTimestamp.now()}</span>
							<span class="text-xs">
								{new Date().toLocaleDateString('en-US', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</span>
						</div>
					</Table.Cell>
					<Table.Cell class="text-right text-sm">1000</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
