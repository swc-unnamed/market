<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { goto, preloadData } from '$app/navigation';

	let { data } = $props();
	let entities = $derived(data.entities);
	let searchText = $state('');

	$effect(() => {
		if (searchText) {
			entities = data.entities.filter((entity) =>
				entity.name.toLowerCase().includes(searchText.toLowerCase())
			);
		} else {
			entities = data.entities;
		}
	});
</script>

<PageWrapper title="Unnamed Database" breadcrumb={[]}>
	<div class="grid grid-cols-1 gap-3">
		<Card.Root>
			<Card.Header>
				<Card.Title>Unnamed Database</Card.Title>
			</Card.Header>

			<Card.Content>
				<Input placeholder="Search..." bind:value={searchText} />
			</Card.Content>
		</Card.Root>

		<div class="bg-card hidden rounded-lg p-3 md:grid">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-24"></Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Type</Table.Head>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{#each entities as entity}
						<Table.Row
							class="hover:cursor-pointer"
							onmouseenter={async () => await preloadData(`/db/${entity.id}`)}
							onclick={async () => await goto(`/db/${entity.id}`)}
						>
							<Table.Cell>
								<img src={entity.imageSmall} alt={entity.name} class="h-16 w-16 rounded-lg" />
							</Table.Cell>
							<Table.Cell>{entity.name}</Table.Cell>
							<Table.Cell class="uppercase">{entity.type}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<div class="grid gap-3 md:hidden">
			{#each entities as entity}
				<Card.Root
					class="hover:cursor-pointer"
					onmouseenter={async () => await preloadData(`/db/${entity.id}`)}
					onclick={async () => await goto(`/db/${entity.id}`)}
				>
					<Card.Content>
						<div class="flex flex-row gap-1">
							<img src={entity.imageSmall} alt={entity.name} class="h-16 w-16 rounded-lg" />
							<div class="grid grid-cols-1">
								<p class="text-xl font-semibold">{entity.name}</p>
								<Badge class="uppercase" variant="outline">
									{entity.type}
								</Badge>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</PageWrapper>
