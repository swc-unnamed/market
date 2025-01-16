<script lang="ts">
	import { cn } from '$lib/utils';

	interface CreditIconProps {
		class?: string;
		onclick?: () => void;
	}

	let { class: className, onclick }: CreditIconProps = $props();
</script>

<span class={cn('', className)} style="font-family: 'Galactic Basic';">$</span>
