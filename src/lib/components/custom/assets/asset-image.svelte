<script lang="ts">
	type AssetImageProps = {
		id: string;
	};

	let { id }: AssetImageProps = $props();

	async function fetchImage() {
		const response = await fetch(`/api/combine/images/${id}`);

		const data = await response.json();

		console.log(data);

		return data;
	}
</script>

{#await fetchImage()}
	<p>Loading...</p>
{:then data}
	<img src={data.small} alt={data.small} />
{:catch error}
	<p>{error.message}</p>
{/await}
