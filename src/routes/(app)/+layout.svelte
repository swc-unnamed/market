<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/custom/sidebar/app-sidebar.svelte';

	import { setContext } from 'svelte';
	import type { UserContext } from '$lib/stores';
	import { USER_CONTEXT } from '$lib/stores/contexts';
	let { children, data } = $props();

	setContext<UserContext>(USER_CONTEXT, data.user);
</script>

<Sidebar.Provider open={true}>
	<AppSidebar />
	{@render children?.()}
</Sidebar.Provider>
