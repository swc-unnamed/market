<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';

	import { UserContextKey, type UserContext } from '$lib/context/user.context';
	import { getContext } from 'svelte';

	const userContext = getContext<UserContext>(UserContextKey);
</script>

<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Link href="/auction-house/admin">Main Terminal</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href="/auction-house/admin/live-auctions">
				Live Auctions
			</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href="/auction-house/admin/listings">Listings</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
