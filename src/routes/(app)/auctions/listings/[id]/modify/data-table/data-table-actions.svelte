<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';

	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';

	let { id, assetId, listingId }: { id: string; assetId: string | null; listingId: string } =
		$props();
	let deleteItemDialogOpen = $state(false);

	async function handleItemDelete({ listingId, itemId }: { listingId: string; itemId: string }) {
		const res = await fetch(`/api/auctions/listings/${listingId}/items/${itemId}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			const data = await res.json();
			deleteItemDialogOpen = false;
			toast(data.message);
			await invalidate('auction_listing_modify');
		} else {
			toast('Failed to delete item');
			deleteItemDialogOpen = false;
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Icon icon="tabler:menu" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<!-- <DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
				
			</DropdownMenu.Item>
		</DropdownMenu.Group> -->
		<!-- <DropdownMenu.Separator /> -->
		<DropdownMenu.Item
			disabled={assetId === null}
			onclick={async () => {
				await goto(`/assets/${assetId}`);
			}}
		>
			{#if assetId}
				Asset Ledger
			{:else}
				Asset Ledger Unavailable
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => (deleteItemDialogOpen = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root bind:open={deleteItemDialogOpen}>
	<!-- <AlertDialog.Trigger class="w-full md:w-auto">
		<Button size="sm" variant="action" class="text-red-500">
			<AurebeshText text="D" />
			Delete
		</Button>
	</AlertDialog.Trigger> -->
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				We wil delete this item from the listing. We won't be able to add it back, but you can
				always add a new item.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={async () => {
					await handleItemDelete({
						listingId: listingId,
						itemId: id
					});
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
