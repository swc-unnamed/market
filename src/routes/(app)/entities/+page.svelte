<script lang="ts">
	import { columns, type Asset } from '$lib/components/custom/assets/column.js';
	import DataTable from '$lib/components/custom/assets/data-table.svelte';
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import Icon from '$lib/components/custom/shared/icon.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { entities } from '$lib/server/db/schema/entities.js';
	import type { InferSelectModel } from 'drizzle-orm';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';

	let { data } = $props();

	let newAssetDialogOpen = $state(false);

	const assetData: Asset[] = $derived(data.assets);
</script>

<LayoutWrapper title="Assets">
	{#snippet right()}
		<Dialog.Root>
			<Dialog.Trigger>
				<Button>
					<Icon icon="mdi:plus" />
					Create Entity
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>New Entity</Dialog.Title>
					<Dialog.Description>
						This feature is still under development. It's planned for a later release.
					</Dialog.Description>
				</Dialog.Header>

				<!-- <div class="grid grid-cols-1 gap-2">
					<Label for="assetName">Asset Name</Label>
					<Input />
				</div>

				<div class="grid grid-cols-1 gap-2">
					<Label for="assetName">Type</Label>
					<Input />
					<span class="text-xs"> If this is a custom asset, this should be 'custom'. </span>
				</div>

				<div class="grid grid-cols-1 gap-2">
					<Label for="assetName">API Link</Label>
					<Input />
					<span class="text-xs">
						e.g. https://www.swcombine.com/ws/v2.0/types/ships/jumpmaster%205000/
					</span>
				</div> -->
			</Dialog.Content>
		</Dialog.Root>
	{/snippet}
	<pre>{JSON.stringify(data.records)}</pre>
	<!--	<DataTable data={assetData} {columns} />-->
</LayoutWrapper>
