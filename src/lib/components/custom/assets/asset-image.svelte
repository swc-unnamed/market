<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { cn } from '$lib/utils';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		id,
		large,
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		id: string;
		large?: boolean;
	} = $props();

	async function fetchImage() {
		const response = await fetch(`/api/combine/images/${id}`);

		const data = await response.json();
		return data;
	}
</script>

{#await fetchImage()}
	<Skeleton class="h-[100px] w-[100px]" />
{:then data}
	{#if large}
		<img class={cn('rounded-md', className)} src={data.large} alt={data.small} {...restProps} />
	{:else}
		<img class={cn('rounded-md', className)} src={data.small} alt={data.small} {...restProps} />
	{/if}
{:catch error}
	<img src="/assets/uim-animated.gif" class="h-[100px] w-[100px]" alt="animated_gif" />
{/await}
