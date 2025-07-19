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
			<NavigationMenu.Link href="/auction-house/dashboard">Dashboard</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href="/auction-house/listings">Browse Listings</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
