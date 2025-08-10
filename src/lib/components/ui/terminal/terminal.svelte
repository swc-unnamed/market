<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
	import { Window } from '$lib/components/ui/window';
	import { cn } from '$lib/utils/extras/utils';
	import { useTerminalRoot } from './terminal.svelte.js';
	import { onMount } from 'svelte';
	import type { TerminalRootProps } from './types.js';

	let {
		delay = 0,
		speed = 1,
		onComplete = () => {},
		children,
		class: className,
		useWindow = true
	}: TerminalRootProps & { useWindow?: boolean } = $props();

	const terminal = useTerminalRoot({ delay, speed, onComplete });

	onMount(() => {
		// we play here so that we don't play before it is visible (on the server)
		terminal.play();

		return () => {
			terminal.dispose();
		};
	});
</script>

{#if useWindow}
	<!-- Use a window if specified -->
	<Window class={cn('font-mono text-sm font-light', className)}>
		{@render children?.()}
	</Window>
{:else}
	<!-- Render without a window -->
	<div class={cn('font-mono text-sm font-light', className)}>
		{@render children?.()}
	</div>
{/if}
