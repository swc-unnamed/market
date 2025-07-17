<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { type UserContext, UserContextKey } from '$lib/context/user.context';
	import { Menu, Plus, SatelliteDish, Shield } from '@lucide/svelte';
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="ghost" size="sm">
			<Menu class="size-6" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end" sideOffset={4}>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Admin Actions</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				onclick={async () => {
					await goto('/auction-house/admin');
				}}
				onmouseenter={async () => {
					await preloadData('/auction-house/admin');
				}}
			>
				Dashboard
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onclick={async () => {
					await goto('/auction-house/admin/live-auctions');
				}}
				onmouseenter={async () => {
					await preloadData('/auction-house/admin/live-auctions');
				}}
			>
				Live Auctions
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onclick={async () => {
					toast.info('This feature is not yet implemented.');
				}}
			>
				Listings
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
