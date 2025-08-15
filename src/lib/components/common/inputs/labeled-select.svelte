<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils/tw';
	interface LabeledSelectProps {
		options: { [key: string]: any }[];
		key: string;
		disabled?: boolean;
		label: string;
		selectLabel: string;
		value?: string | number | undefined | null;
		id?: string;
		error?: string | string[];
		description?: string;
		placeholder?: string;
		destructive?: boolean;
		onValueChange?: (value: string) => void;
	}

	let {
		options,
		key,
		id,
		disabled = false,
		label,
		error,
		description,
		selectLabel,
		placeholder,
		value = $bindable(),
		destructive = false,
		onValueChange
	}: LabeledSelectProps = $props();
</script>

<div class="flex w-full flex-col gap-1.5">
	<Label for={id || ''}>{label}</Label>
	<Select.Root
		{disabled}
		{onValueChange}
		type="single"
		name={id || ''}
		bind:value={value as string}
	>
		<Select.Trigger class={cn(destructive && 'focus:ring-destructive w-full', 'w-full')}>
			{options.find((option) => option[key] === value)?.[selectLabel] ||
				placeholder ||
				'Select an option'}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each options as option}
					<Select.Item value={option[key]} label={option[selectLabel]}
						>{option[selectLabel]}</Select.Item
					>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
	{#if error}
		<small class="text-destructive">{error}</small>
	{/if}
	<p class="text-muted-foreground text-sm">{description}</p>
</div>
