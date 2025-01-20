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

		console.log(data);

		return data;
	}
</script>

{#await fetchImage()}
	<Skeleton class="h-48 w-full" />
{:then data}
	<img class={className} src={large ? data.large : data.small} alt={data.small} {...restProps} />
{:catch error}
	<p>{error.message}</p>
{/await}
