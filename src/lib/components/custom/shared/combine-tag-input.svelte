<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';

	interface Props {
		class?: string;
		tags: string[];
		label?: string;
		description?: string;
	}

	let { tags = $bindable(), class: className, label, description }: Props = $props();
	let input = $state<string>('');
</script>

<div class={cn('grid grid-cols-1 gap-2', className)}>
	<Label>{label ?? 'Tags'}</Label>
	<Input
		bind:value={input}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				tags = [...tags, input];
				input = '';
			}

			if (e.key === 'Tab') {
				e.preventDefault();
				tags = [...tags, input];
				input = '';
			}
		}}
	/>
	{#if description}
		<span class="text-sm text-muted-foreground">
			{description}
		</span>
	{/if}
	<div class="flex flex-wrap items-center gap-1">
		{#each tags as tag}
			<Badge
				class="flex items-center justify-between"
				onclick={() => (tags = tags.filter((t) => t !== tag))}
			>
				<Icon
					icon="tabler:x"
					class="size-4 justify-end"
					on:click={() => (tags = tags.filter((t) => t !== tag))}
				/>
				<span>{tag}</span>
			</Badge>
		{/each}
	</div>
</div>
