<script lang="ts">
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';

	interface IconProps {
		icon: string;
		class?: string;
		onclick?: () => void;
	}

	let { icon, class: className, onclick }: IconProps = $props();
</script>

<Icon {onclick} {icon} class={cn('block p-0 font-bold text-inherit', className)} />
