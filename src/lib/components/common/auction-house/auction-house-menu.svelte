<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Menu, Plus, SatelliteDish, Shield } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	async function createDraft() {
		toast.loading('Creating draft listing...', {
			id: 'create-draft'
		});
		const response = await fetch(`/api/auction-house/listings/drafts`, {
			method: 'post'
		});

		if (!response.ok) {
			toast.error(`Failed to create draft listing`, {
				description: `Error: ${response.statusText}`
			});

			toast.error('Failed to create draft', {
				description: `Reason: ${response.statusText}`
			});

			return;
		}

		const data: { draftId: string } = await response.json();

		toast.dismiss('create-draft');

		toast.success('Draft created', {
			description: `Do you want to view it now?`,
			action: {
				label: 'Yes',
				onClick: async () => await goto(`/auction-house/listings/${data.draftId}/edit`)
			},
			dismissable: true
		});
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({
			variant: 'ghost',
			size: 'sm'
		})}
	>
		<Menu class="size-6" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end" sideOffset={4}>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={createDraft}>
				<Plus />
				<span>Create Listing</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<button
					class="flex items-center gap-2"
					onmouseenter={async () => {
						await preloadData('/auction-house/auctions');
					}}
					onclick={async () => await goto('/auction-house/auctions')}
				>
					<SatelliteDish />
					Auctions
				</button>
			</DropdownMenu.Item>
			<!-- {#if GlobalAuctioneerAccessPolicy.includes(userContext.role)}
				<DropdownMenu.Item>
					<button
						class="flex items-center gap-2"
						onmouseenter={async () => {
							await preloadData('/auction-house/admin');
						}}
						onclick={async () => await goto('/auction-house/admin')}
					>
						<Shield />
						<span>Admin Terminal</span>
					</button>
				</DropdownMenu.Item>
			{/if} -->
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
