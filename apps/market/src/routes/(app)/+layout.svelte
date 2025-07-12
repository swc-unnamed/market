<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import { type UserContext, UserContextKey } from '$lib/context/user.context';
	import { setContext } from 'svelte';
	import { TerminalContextKey, type TerminalContext } from '$lib/context/terminal.context.js';
	let { children, data } = $props();

	setContext<UserContext>(UserContextKey, data.user);
	setContext<TerminalContext>(TerminalContextKey, data.termina);
</script>

<Sidebar.Provider>
	<AppSidebar />
	{@render children?.()}
</Sidebar.Provider>
