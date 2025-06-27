<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import * as Avatar from '$lib/components/ui/avatar';
	import { toast } from 'svelte-sonner';

	type DataItem = {
		id: string;
		name: string;
		quantity: number;
		image?: string;
		uuu: boolean;
	};

	type Props = {
		data: DataItem[];
	};

	let { data }: Props = $props();
</script>

<div class="w-full">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-48"></Table.Head>
				<Table.Head class="w-48">Name</Table.Head>
				<Table.Head class="w-24">Quantity</Table.Head>
				<Table.Head class="w-24">U/U/U</Table.Head>
				<Table.Head class="text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data as item (item.id)}
				<Table.Row>
					<Table.Cell>
						<Avatar.Root class="size-24 rounded-none">
							<Avatar.Image class="rounded-none" src={item.image} alt={item.name} />
							<Avatar.Fallback
								class="flex h-24 w-24 items-center justify-center rounded-md p-3 text-xs text-wrap"
							>
								{item.name}
							</Avatar.Fallback>
						</Avatar.Root>
					</Table.Cell>
					<Table.Cell class="truncate">
						{item.name}
					</Table.Cell>
					<Table.Cell>
						{item.quantity}
					</Table.Cell>
					<Table.Cell>
						{item.uuu ? 'Yes' : 'No'}
					</Table.Cell>
					<Table.Cell class="text-right">
						<Button
							variant="outline"
							size="sm"
							onclick={() => {
								toast('Under construction: Edit functionality not implemented yet');
							}}>Edit</Button
						>
						<Button
							variant="outline"
							size="sm"
							onclick={() => {
								toast('Under construction: Delete functionality not implemented yet');
							}}>Remove</Button
						>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
