<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import { type UserContext, UserContextKey } from '$lib/context/user.context';
	import { setContext } from 'svelte';
	import { TerminalContextKey, type TerminalContext } from '$lib/context/terminal.context.js';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	let { children, data } = $props();

	setContext<UserContext>(UserContextKey, data.user);
	setContext<TerminalContext>(TerminalContextKey, data.terminal);
</script>

<svelte:head>
	<meta property="og:title" content="Unnamed Market" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.baseUrl} />
	<meta property="og:image" content={`${data.baseUrl}/images/uim-17.png`} />
	<meta property="og:description" content="Unnamed Market - Your gateway to the holochain." />
	<meta name="theme-color" content="#0a0a0a" />

	<!-- Include this to make the og:image larger -->
	<meta name="twitter:card" content={`${data.baseUrl}/images/uim-17.png`} />
</svelte:head>

<Sidebar.Provider>
	<AppSidebar />
	{@render children?.()}
</Sidebar.Provider>
