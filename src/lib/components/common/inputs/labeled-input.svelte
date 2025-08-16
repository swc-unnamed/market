<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils/tw';
	import type { Snippet } from 'svelte';
	interface LabeledInputProps {
		id?: string;
		label: string;
		maxlength?: number;
		type?: HTMLInputElement['type'];
		placeholder?: string;
		description?: string;
		error?: string | string[];
		value?: string | number | null;
		destructive?: boolean;
		onchange?: HTMLInputElement['onchange'];
		class?: string;
		disabled?: boolean;
		onkeydown?: (e: KeyboardEvent) => void;
		inputAfterContent?: string;
		inputEnd?: Snippet;
	}
	let {
		id = undefined,
		label,
		type = 'text',
		placeholder = '',
		description,
		error,
		value = $bindable(),
		destructive = false,
		class: className,
		disabled,
		inputAfterContent,
		maxlength,
		onkeydown,
		onchange,
		inputEnd
	}: LabeledInputProps = $props();
</script>

<div class="relative flex w-full flex-col gap-1.5">
	<Label for={id || ''}>{label}</Label>
	<Input
		{maxlength}
		{onkeydown}
		{disabled}
		autocomplete="off"
		class={cn(className, 'w-full')}
		{onchange}
		{type}
		{id}
		name={id}
		{placeholder}
		bind:value
	/>
	{@render inputEnd?.()}

	{#if error}
		<small class="text-destructive">{error}</small>
	{/if}
	<p class="text-muted-foreground text-sm">{description}</p>
</div>
