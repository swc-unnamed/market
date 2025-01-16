<script lang="ts">
	import Icon from '$lib/components/custom/shared/icon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher defaultMode={'dark'} />
<Toaster />

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
