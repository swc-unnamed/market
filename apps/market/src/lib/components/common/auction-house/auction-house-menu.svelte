<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, preloadData } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { type UserContext, UserContextKey } from '$lib/context/user.context';
	import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies';
	import { Menu, Plus, SatelliteDish, Shield } from '@lucide/svelte';
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';

	const userContext = getContext<UserContext>(UserContextKey);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="ghost" size="sm">
			<Menu class="size-6" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end" sideOffset={4}>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<form
					action="/auction-house/dashboard?/createDraft"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type == 'success') {
								await goto(`/auction-house/listings/${result.data?.draftId}/edit`);
								toast.success('Draft listing created successfully');
							}

							if (result.type == 'error') {
								toast.error('Failed to create listing', {
									description: result.error.message
								});
							}
						};
					}}
				>
					<button type="submit" class="flex items-center gap-2">
						<Plus />
						<span>Create Listing</span>
					</button>
				</form>
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
			{#if GlobalAuctioneerAccessPolicy.includes(userContext.role)}
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
			{/if}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
