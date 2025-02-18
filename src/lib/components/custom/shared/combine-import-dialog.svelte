<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import type { UserContext } from '$lib/stores';
	import { USER_CONTEXT } from '$lib/stores/contexts';
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';

	const userContext = getContext<UserContext>(USER_CONTEXT);

	let selectedEntityType = $state<string | undefined>(undefined);

	async function getShips() {
		const res = await fetch('/api/combine/inventory/ships', {
			method: 'GET'
		});

		if (res.ok) {
			const data = await res.json();
			console.log(data.data);
			return data.data;
		} else {
			console.error('Failed to fetch ships');
		}
	}
</script>

<Dialog.Root open>
	<Dialog.Trigger class={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'border-primary')}>
		Import From Combine
	</Dialog.Trigger>
	<Dialog.Content class="h-full w-2/3">
		<Dialog.Title>Import Entity from the Combine</Dialog.Title>
		<p>Doing the thing</p>

		<Select.Root type="single" bind:value={selectedEntityType}>
			<Select.Trigger>
				{selectedEntityType ?? 'Select an entity type'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="ships">Ship</Select.Item>
			</Select.Content>
		</Select.Root>

		<div class="grid grid-cols-1 gap-2">
			{#await getShips()}
				<p>Loading...</p>
			{:then data}
				{#each data.swcapi.entities.entity as ship}
					<div>{ship.value.name}</div>
					<div>{JSON.stringify(ship.value.type)}</div>
				{/each}
			{:catch error}
				<p>Error: {error.message}</p>
			{/await}
		</div>
	</Dialog.Content>
</Dialog.Root>
