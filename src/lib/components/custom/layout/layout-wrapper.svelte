<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '$lib/components/custom/shared/icon.svelte';
	import SnackbarActionButton from './snackbar-action-button.svelte';
	import { cn } from '$lib/utils';

	interface LayoutWrapperProps {
		title: string;
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
		{title} | Unnamed Imperium Market
	</title>
</svelte:head>

<Sidebar.Inset>
	<header
		class="transition=[width,height] ease-linear, z-10 flex h-fit flex-col justify-center gap-2 rounded backdrop-blur-lg group-has-[[data-collasibile=icon]]/siebar-wrapper:h-fit md:sticky md:top-0 md:py-2"
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
				{:else}
					<SnackbarActionButton />
				{/if}
			</div>
		</div>
	</header>
	<div id="layout-wrapper" class={'container'}>
		{@render children()}
	</div>
</Sidebar.Inset>
