<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useSidebar } from '../ui/sidebar';
	import * as Sidebar from '../ui/sidebar';
	import { Separator } from '../ui/separator';
	import * as Breadcrumb from '../ui/breadcrumb';
	import Terminal from '$lib/novu/client/terminal.svelte';
	interface PageWrapperProps {
		title?: string;
		subTitle?: string;
		displayTitle?: boolean;
		children: Snippet;
		right?: Snippet;
		left?: Snippet;
		center?: Snippet;
		navigation?: Snippet;
		breadcrumb?: {
			title: string;
			href?: string;
		}[];
		description?: string;
	}
	const sidebar = useSidebar();

	let {
		title,
		subTitle,
		displayTitle = true,
		children,
		right,
		center,
		left,
		navigation,
		breadcrumb,
		description
	}: PageWrapperProps = $props();

	let isSidebarOpen = $state(sidebar.open);
</script>

<svelte:head>
	<title>
		{title} - Unnamed Market
	</title>
</svelte:head>

<Sidebar.Inset>
	<header class="flex h-16 shrink-0 items-center gap-2">
		<div class="flex w-full items-center justify-between">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Breadcrumb.Root>
					{#if breadcrumb}
						<Breadcrumb.List>
							{#each breadcrumb as crumb}
								<Breadcrumb.Item class="hidden md:block">
									{#if crumb.href}
										<Breadcrumb.Link href={crumb.href}>
											{crumb.title}
										</Breadcrumb.Link>
									{:else}
										<Breadcrumb.Page>{crumb.title}</Breadcrumb.Page>
									{/if}
								</Breadcrumb.Item>
								<Breadcrumb.Separator class="hidden md:block" />
							{/each}
							<Breadcrumb.Item>
								<Breadcrumb.Page>{title}</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					{:else}
						<Breadcrumb.Item>
							<Breadcrumb.Page>{title}</Breadcrumb.Page>
						</Breadcrumb.Item>
					{/if}
				</Breadcrumb.Root>
			</div>

			<div class="flex items-center gap-2 pr-4">
				<Terminal
					tabs={[
						{
							label: 'All',
							value: []
						},
						{
							label: 'Auction House',
							value: ['auction house', 'listings']
						}
					]}
				/>
				<div>
					{@render right?.()}
				</div>
			</div>
		</div>
	</header>

	{#if navigation}
		<div class="w-full px-4">
			{@render navigation?.()}
		</div>
	{/if}

	<main class="w-full p-4">
		{@render children?.()}
	</main>
</Sidebar.Inset>
