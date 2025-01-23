<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import Icon from '@iconify/svelte';
	import type { UserContext } from '$lib/stores';
	import { getContext } from 'svelte';
	import { USER_CONTEXT } from '$lib/stores/contexts';
	import type { Route } from '$lib/consts/layout/route';
	import { goto, preloadData } from '$app/navigation';

	const user = getContext<UserContext>(USER_CONTEXT);

	const sidebar = useSidebar();
	let isSidebarOpen = $derived(sidebar.open);

	const settingsRoutes: Route[] = [
		{
			title: 'Settings',
			href: '/settings',
			icon: 'mdi:cog',
			nested: [
				{
					title: 'Access Control',
					href: '/settings/access-control',
					icon: 'mdi:shield-account',
					allowedRoles: ['magistrate', 'holochain_architect', 'market_tzar']
				},
				{
					title: 'System Settings',
					href: '/settings/system',
					icon: 'mdi:settings',
					allowedRoles: ['holochain_architect', 'market_tzar']
				}
			],
			allowedRoles: ['magistrate', 'holochain_architect', 'market_tzar']
		}
	];
</script>

<Sidebar.Menu>
	{#each settingsRoutes as route (route.title)}
		{#if route.allowedRoles.includes(user.role)}
			<Collapsible.Root class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Collapsible.Trigger
							onmouseover={async () => {
								if (!route.nested?.length || !isSidebarOpen) {
									await preloadData(route.href);
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
													{#if subItem.allowedRoles.includes(user.role)}
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
													{/if}
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
		{/if}
	{/each}
</Sidebar.Menu>
