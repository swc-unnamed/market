<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/custom/sidebar/app-sidebar.svelte';

	import { setContext } from 'svelte';
	import type { User } from '$lib/models/shared/user.js';
	let { children, data } = $props();

	setContext<User>('user', data.user);
</script>

<Sidebar.Provider open={false}>
	<AppSidebar />
	{@render children?.()}
</Sidebar.Provider>
