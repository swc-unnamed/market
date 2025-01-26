<script lang="ts">
	import Icon from '$lib/components/custom/shared/icon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	let { children, data } = $props();
</script>

<svelte:head>
	<meta property="og:title" content="Unnamed Imperium Market" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.baseUrl} />
	<meta property="og:image" content={`${data.baseUrl}/assets/uim-17.png`} />
	<meta
		property="og:description"
		content="Unnamed Imperium Market - Your gateway to the holochain."
	/>
	<meta name="theme-color" content="#facc15" />

	<!-- Include this to make the og:image larger -->
	<meta name="twitter:card" content={`${data.baseUrl}/assets/uim-17.png`} />
</svelte:head>

<ModeWatcher defaultMode={'dark'} />
<Toaster richColors />

{@render children?.()}

<div class="flex items-center justify-end bg-sidebar p-8">
	<div class="flex items-center gap-2">
		<a href="#" class="flex items-center gap-1 text-xs text-foreground">
			<Icon icon="mdi:discord" class="size-4" />
			<span>Connect on Discord</span>
		</a>
		<a
			class="flex items-center gap-1 text-xs text-foreground"
			target="_blank"
			href="https://www.swcombine.com"
		>
			<Icon icon="mdi:external-link" class="size-4" />
			<span>Star Wars Combine</span>
		</a>
	</div>
</div>
