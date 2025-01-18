<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import CreditIcon from '../shared/credit-icon.svelte';

	interface CreditInputProps {
		class?: string;
		label?: string;
		onchange?: HTMLInputElement['onchange'];
		tabindex?: number;
		value?: string | null;
		disableHelperText?: boolean;
		disabled?: boolean;
	}

	const NUMBER_REGEX = RegExp(/[^0-9,]/, '');

	let {
		class: className,
		label,
		onchange,
		value = $bindable(),
		disableHelperText = false,
		disabled,
		tabindex
	}: CreditInputProps = $props();
</script>

<div class="relative flex w-full flex-col gap-2">
	<Label>{label ?? 'Credits'}</Label>
	<div class="flex items-center">
		<Button
			variant="outline"
			class="rounded-br-none rounded-tr-none border-r-0 disabled:opacity-100"
			disabled
		>
			<CreditIcon class="text-xl text-primary" />
		</Button>
		<Input
			{onchange}
			bind:value
			{disabled}
			{tabindex}
			class={cn('rounded-bl-none rounded-tl-none border-l-0', className)}
			oninput={(input) => {
				if (NUMBER_REGEX.test(input.currentTarget.value)) {
					input.currentTarget.value = input.currentTarget.value.replace(NUMBER_REGEX, '');
				}
			}}
		/>
	</div>
	{#if !disableHelperText}
		<span class="ml-2 text-xs text-muted-foreground"> e.g. 100,000,000 or 100000000 </span>
	{/if}
</div>
