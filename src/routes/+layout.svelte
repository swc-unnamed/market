<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	let { children, data } = $props();
</script>

<svelte:head>
	<meta property="og:title" content="Unnamed Market" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.baseUrl} />
	<meta property="og:image" content={`${data.baseUrl}/assets/uim-17.png`} />
	<meta property="og:description" content="Unnamed Market - Your gateway to the holochain." />
	<meta name="theme-color" content="#0a0a0a" />

	<!-- Include this to make the og:image larger -->
	<meta name="twitter:card" content={`${data.baseUrl}/assets/uim-17.png`} />
</svelte:head>

<ModeWatcher defaultMode={'dark'} />
<Toaster richColors />

{@render children?.()}
