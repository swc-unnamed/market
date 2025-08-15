<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	interface LabeledInputProps {
		id?: string;
		label: string;
		type?: HTMLInputElement['type'];
		placeholder?: string;
		description?: string;
		error?: string | string[];
		value?: string | number | null;
		destructive?: boolean;
		onchange?: HTMLInputElement['onchange'];
		class?: string;
		rows?: number;
		disabled?: boolean;
		maxLength?: number;
	}
	let {
		id = undefined,
		label,
		maxLength,
		placeholder = '',
		description,
		disabled = false,
		error,
		value = $bindable(),
		destructive = false,
		class: className,
		onchange,
		rows
	}: LabeledInputProps = $props();
</script>

<div class="flex w-full flex-col gap-1.5">
	<Label for={id || ''}>{label}</Label>
	<Textarea
		maxlength={maxLength}
		{rows}
		{disabled}
		autocomplete="off"
		class={className}
		{onchange}
		{id}
		name={id}
		{placeholder}
		bind:value
	/>
	{#if error}
		<small class="text-destructive">{error}</small>
	{/if}
	<p class="text-muted-foreground text-sm">{description}</p>
</div>
