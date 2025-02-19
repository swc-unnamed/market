<script lang="ts">
	interface Props {
		location: {
			x: number | string;
			y: number | string;
			type: string;
		}[];
	}

	let { location }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-1">
	{#each location as { x, y, type }, i}
		<div class="flex gap-1">
			<div class="text-center text-xs">{type}</div>
			<div class="text-center text-xs">{x},{y}</div>
		</div>
	{/each}
</div>
