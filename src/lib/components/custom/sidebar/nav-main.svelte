<script lang="ts">
	import type { Route } from '$lib/consts/layout/route';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import Icon from '@iconify/svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { goto, preloadData } from '$app/navigation';
	import { getContext } from 'svelte';

	const routes: Route[] = [
		{
			title: 'Home',
			href: '/home',
			icon: 'mdi:home',
			nested: []
		},
		{
			title: 'Auctions',
			href: '/auctions',
			icon: 'mdi:invoice-line-items',
			nested: []
		},
		{
			title: 'Assets',
			href: '/assets',
			icon: 'mdi:database',
			nested: []
		}
	];

	const sidebar = useSidebar();

	let isSidebarOpen = $derived(sidebar.open);
</script>

<Sidebar.Group>
	<Sidebar.Menu>
		{#each routes as route (route.title)}
			<Collapsible.Root class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Collapsible.Trigger
							onmouseover={async () => {
								if (!route.nested?.length || !isSidebarOpen) {
									preloadData(route.href);
								}
							}}
							onclick={async () => {
								if (!route?.nested?.length || !isSidebarOpen) {
									await goto(route.href);
								}
							}}
							onauxclick={() => {
								if (!route.nested?.length || !isSidebarOpen) {
									window.open(route.href, '_blank');
								}
							}}
						>
							{#snippet child({ props })}
								<Sidebar.MenuButton {...props}>
									{#snippet tooltipContent()}
										{route.title}
									{/snippet}
									{#if route.icon}
										<Icon icon={route.icon} class="h-8 w-8 text-xl" />
									{/if}
									<span class="text-lg">{route.title}</span>
									{#if route?.nested?.length}
										<Icon
											icon="tabler:chevron-right"
											class="ml-auto h-6 w-6 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									{/if}
								</Sidebar.MenuButton>
							{/snippet}
						</Collapsible.Trigger>

						<Collapsible.Content>
							{#if route.nested?.length}
								<Sidebar.MenuSub>
									<Sidebar.MenuSubButton>
										{#snippet child({ props })}
											{#if route.nested}
												{#each route.nested as subItem (subItem.title)}
													<Sidebar.MenuSubItem>
														<Sidebar.MenuSubButton>
															{#snippet child({ props })}
																<a href={subItem.href} {...props}>
																	{#if subItem.icon}
																		<Icon icon={subItem.icon} class="h-6 w-6" />
																	{/if}
																	<span>{subItem.title}</span>
																</a>
															{/snippet}
														</Sidebar.MenuSubButton>
													</Sidebar.MenuSubItem>
												{/each}
											{/if}
										{/snippet}
									</Sidebar.MenuSubButton>
								</Sidebar.MenuSub>
							{/if}
						</Collapsible.Content>
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
