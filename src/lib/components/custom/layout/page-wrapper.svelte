<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '$lib/components/custom/shared/icon.svelte';

	interface LayoutWrapperProps {
		title?: string;
		subTitle?: string;
		displayTitle?: boolean;
		children: Snippet;
		right?: Snippet;
		left?: Snippet;
		center?: Snippet;
	}

	let {
		title,
		subTitle,
		displayTitle = true,
		children,
		right,
		left,
		center
	}: LayoutWrapperProps = $props();

	const sidebar = Sidebar.useSidebar();
</script>

<svelte:head>
	<title>
		{title} | Unnamed Market
	</title>
</svelte:head>

<Sidebar.Inset>
	<header
		class="transition=[width,height] ease-linear, z-10 flex h-fit flex-col justify-center gap-2 rounded border border-b-primary bg-background group-has-[[data-collasibile=icon]]/siebar-wrapper:h-fit md:sticky md:top-0 md:py-2"
	>
		<div class="flex w-full items-center justify-between gap-2 px-4 py-2">
			<div class="flex min-w-fit items-center gap-2">
				<Button size="icon" variant="outline" onclick={() => sidebar.toggle()}>
					<Icon icon={sidebar.open ? 'mdi:menu-open' : 'mdi:menu-close'} />
				</Button>

				{#if displayTitle}
					<div class="grid">
						<h1>{title}</h1>
					</div>
				{/if}

				{@render left?.()}
			</div>
			<div class="flex items-center justify-end gap-4">
				{#if center}
					{@render center?.()}
				{/if}
				{#if right}
					{@render right?.()}
				{/if}
			</div>
		</div>
	</header>
	<div class="w-full p-1 md:container md:p-0">
		<div class="mb-3 mt-3">
			{@render children?.()}
		</div>
	</div>
</Sidebar.Inset>
