<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
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
	<Skeleton class="h-24 w-full" />
{:then data}
	<img class={className} src={large ? data.large : data.small} alt={data.small} {...restProps} />
{:catch error}
	<img src="/assets/uim-animated.gif" class="h-8 w-8" alt="animated_gif" />
{/await}
