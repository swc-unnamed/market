<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Icon from '../shared/icon.svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button size="sm" variant="outline">
			<div class="flex items-center gap-2">
				<span>Terminal</span>
				<Icon icon="mdi:terminal-line" class="size-10" />
			</div>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content sideOffset={4} alignOffset={-4} class="mr-4">
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={async () => await goto('/auctions/listings/new')}>
				Create Auction Listing
			</DropdownMenu.Item>
			<DropdownMenu.Item>My Profile</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Discord</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
