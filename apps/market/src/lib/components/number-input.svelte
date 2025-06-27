<script lang="ts">
	import type { WithElementRef } from 'bits-ui';
	import Input from './ui/input/input.svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn } from '$lib/utils/tw';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		class: className,
		...restProps
	}: Props = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		target.value = target.value.replace(/[^\d,]/g, '');
	}
</script>

<Input bind:ref bind:value {type} class={className} oninput={handleInput} />
