<script lang="ts">
	import { Progress } from '$lib/components/ui/progress/index.js';

	interface Props {
		value: number;
		max: number;
	}

	let { value, max }: Props = $props();
</script>

<Progress class="bg-danger" {value} {max} />
