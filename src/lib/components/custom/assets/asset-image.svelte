<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	type AssetImageProps = {
		id: string;
		large?: boolean;
	};

	let { id, large }: AssetImageProps = $props();

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
	<img class="" src={large ? data.large : data.small} alt={data.small} />
{:catch error}
	<p>{error.message}</p>
{/await}
