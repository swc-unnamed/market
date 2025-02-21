<script lang="ts">
	import { Progress } from '$lib/components/ui/progress/index.js';

	interface Props {
		value: number;
		max: number;
		title?: string;
	}

	let { value, max, title }: Props = $props();
</script>

<p class="text-center text-xs uppercase">{title}</p>
<div class="relative w-full">
	<Progress {value} {max} />

	<span class="inset-0 hidden items-center justify-center text-xs md:absolute md:flex">
		{value} / {max}
	</span>
</div>
