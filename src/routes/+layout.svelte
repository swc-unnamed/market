<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	let { children } = $props();
</script>

<ModeWatcher defaultMode={'dark'} />
<Toaster theme="dark" position={'top-right'} />
{@render children()}
