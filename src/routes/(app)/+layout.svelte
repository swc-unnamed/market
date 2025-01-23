<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/custom/sidebar/app-sidebar.svelte';

	import { setContext } from 'svelte';
	import type { UserContext } from '$lib/stores';
	import { USER_CONTEXT } from '$lib/stores/contexts';
	let { children, data } = $props();

	setContext<UserContext>(USER_CONTEXT, data.user);
</script>

<svelte:head>
	<meta name="description" content="Unnamed Imperium Market - Your gateway to the holochain." />
	<meta name="author" content="Unnamed Imperium Market" />
	<meta property="og:title" content="Unnamed Imperium Market" />
	<meta
		property="og:description"
		content="Unnamed Imperium Market - Your gateway to the holochain."
	/>
	<meta property="og:image" content={`${data.baseUrl}/assets/unnamed-logo.png`} />
	<meta property="og:url" content={data.baseUrl} />
	<meta name="twitter:card" content={`${data.baseUrl}/assets/unnamed-banner.png`} />
	<meta name="twitter:title" content="Unnamed Imperium Market" />
	<meta
		name="twitter:description"
		content="Unnamed Imperium Market - Your gateway to the holochain."
	/>
	<meta name="twitter:image" content={`${data.baseUrl}/assets/unnamed-logo.png`} />
</svelte:head>

<Sidebar.Provider open={true}>
	<AppSidebar />
	{@render children?.()}
</Sidebar.Provider>
