<script lang="ts">
	import Icon from '$lib/components/custom/shared/icon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	let { children, data } = $props();
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

<ModeWatcher defaultMode={'dark'} />
<Toaster richColors />

{@render children?.()}

<div class="flex items-center justify-end bg-sidebar p-8">
	<p style="font-family: 'Galactic Basic'; font-size: xx-small;">
		Powered by Norvik Holonet Solutions
	</p>

	<div class="flex items-center">
		<Button size="sm" variant="link">
			<Icon icon="mdi:discord" class="size-6" />
			<span>Connect on Discord</span>
		</Button>
		<Button size="sm" variant="link" target="_blank" href="https://www.swcombine.com">
			<Icon icon="mdi:external-link" class="size-6" />
			<span>Star Wars Combine</span>
		</Button>
	</div>
</div>
