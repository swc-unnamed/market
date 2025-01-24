<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		text,
		class: className
	}: { text: string; class?: HTMLAttributes<HTMLSpanElement>['class'] } = $props();
</script>

<span class={cn('aurebesh', className)}>
	{text}
</span>
