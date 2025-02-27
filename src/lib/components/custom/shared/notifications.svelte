<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { UserContext } from '$lib/stores';
	import { USER_CONTEXT } from '$lib/stores/contexts';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';

	const userContext = getContext<UserContext>(USER_CONTEXT);
	let auctionCount = $state(0);
	let marketCount = $state(0);

	async function fetchUnreadNotifications() {
		const resp = await fetch(`/api/account/notifications`);
		const data = await resp.json();
		auctionCount = data.auction;
		marketCount = data.market;
	}

	$effect(() => {
		fetchUnreadNotifications();
	});
</script>

<div class="flex items-center gap-2">
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger
				class="rounded-md p-1 transition-colors duration-200 ease-in-out hover:bg-secondary"
			>
				<Icon
					onclick={async () => await goto('/account/notifications')}
					icon="tabler:gavel"
					class={cn('size-6', auctionCount > 0 ? 'animate-pulse text-danger' : '')}
				/>
			</Tooltip.Trigger>
			<Tooltip.Content>
				You have {auctionCount} unread auction notifications.
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
</div>
