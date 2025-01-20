<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import * as Avatar from '$lib/components/ui/avatar';
	import { cn } from '$lib/utils.js';
	import ServerPagination from '$lib/components/custom/layout/server-pagination.svelte';
	import ServerSearch from '$lib/components/custom/layout/server-search.svelte';
	import { goto, preloadData } from '$app/navigation';
	let { data } = $props();

	let meta = $derived(data.meta);
	let records = $derived(data.records);

	let { searchTerm }: { searchTerm: string } = $state({ searchTerm: '' });
</script>

<LayoutWrapper title="Access Control">
	<div class="grid grid-cols-1 gap-3">
		<div class="mt-3 flex flex-row justify-end">
			<div class="w-full">
				<ServerSearch {searchTerm} originalData={data} />
			</div>
		</div>

		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-12"></Table.Head>
					<Table.Head class="w-64">Name</Table.Head>
					<Table.Head>Role</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Caption>
				<ServerPagination {meta} />
			</Table.Caption>
			<Table.Body>
				{#each records as us}
					<Table.Row
						class="hover:cursor-pointer"
						onmousemove={async () => {
							await preloadData(`/settings/access-control/${us.id}`);
						}}
						onclick={async () => {
							await goto(`/settings/access-control/${us.id}`);
						}}
					>
						<Table.Cell>
							<Avatar.Root>
								<Avatar.Image src={us.avatar} />
								<Avatar.Fallback>{us.name[0]}{us.name[1]}</Avatar.Fallback>
							</Avatar.Root>
						</Table.Cell>
						<Table.Cell class="text-wrap">{us.name}</Table.Cell>
						<Table.Cell>{us.role}</Table.Cell>
						<Table.Cell class={cn(us.banned ? 'text-destructive' : 'text-green-500')}>
							{us.banned ? 'Banned' : 'Active'}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</LayoutWrapper>
