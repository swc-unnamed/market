<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import { goto } from '$app/navigation';

	let {
		ref = $bindable(null),
		href,
		class: className,
		...restProps
	}: TabsPrimitive.TriggerProps & {
		href?: string;
	} = $props();
</script>

<TabsPrimitive.Trigger
	bind:ref
	onclick={href
		? async () => {
				await goto(href);
			}
		: undefined}
	class={cn(
		'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
		className
	)}
	{...restProps}
/>
