<script lang="ts">
	import type { Route } from '$lib/consts/layout/route';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import Icon from '@iconify/svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { afterNavigate, goto, preloadData } from '$app/navigation';
	import { getContext } from 'svelte';
	import {
		PatronPermissionPolicy,
		MagistratePermissionPolicy,
		AuctioneerPermissionPolicy,
		HolochainArchitectPermissionPolicy
	} from '$lib/consts/permission-policies';
	import type { UserContext } from '$lib/stores';
	import { USER_CONTEXT } from '$lib/stores/contexts';

	const routes: Route[] = [
		{
			title: 'Terminal',
			href: '/home',
			icon: 'mdi:home',
			nested: [],
			allowedRoles: PatronPermissionPolicy
		},
		{
			title: 'Auction Terminal',
			href: '/auctions',
			icon: 'tabler:gavel',
			allowedRoles: PatronPermissionPolicy,
			initialOpen: false,
			nested: [
				{
					title: 'New Listing',
					href: '/auctions/listings/new',
					icon: 'tabler:circle-plus',
					allowedRoles: PatronPermissionPolicy,
					disablePrefetch: true
				},
				{
					title: 'Available Auctions',
					href: '/auctions',
					icon: 'tabler:gavel',
					allowedRoles: PatronPermissionPolicy
				}
			]
		},
		{
			title: 'Auction Admin',
			href: '/auctions/admin',
			icon: 'tabler:settings',
			allowedRoles: AuctioneerPermissionPolicy,
			initialOpen: false
		},
		{
			title: 'Account Terminal',
			href: '/account/ledger',
			icon: 'tabler:adjustments-search',
			allowedRoles: PatronPermissionPolicy,
			initialOpen: false,
			nested: [
				{
					title: 'Account Ledger',
					href: '/account/ledger',
					icon: 'tabler:adjustments-search',
					allowedRoles: PatronPermissionPolicy
				},
				{
					title: 'AL Drafts',
					href: '/account/draft-listings',
					icon: 'tabler:git-pull-request-draft',
					allowedRoles: PatronPermissionPolicy
				},
				{
					title: 'Settings',
					href: '/account/settings',
					icon: 'tabler:adjustments-search',
					allowedRoles: PatronPermissionPolicy
				}
			]
		},
		{
			title: 'Holochain',
			href: '/entities',
			icon: 'tabler:database',
			allowedRoles: PatronPermissionPolicy,
			initialOpen: false,
			nested: [
				{
					title: 'Entity Database',
					href: '/entities',
					icon: 'tabler:sitemap',
					allowedRoles: PatronPermissionPolicy
				}
			]
		},
		{
			title: 'Admin',
			href: '/settings/system',
			icon: 'tabler:settings',
			allowedRoles: MagistratePermissionPolicy,
			nested: [
				{
					title: 'System Settings',
					href: '/settings/system',
					icon: 'tabler:settings',
					allowedRoles: HolochainArchitectPermissionPolicy
				},
				{
					title: 'User Management',
					href: '/settings/access-control',
					icon: 'tabler:users',
					allowedRoles: MagistratePermissionPolicy
				}
			]
		}
	];
	const sidebar = useSidebar();

	const user = getContext<UserContext>(USER_CONTEXT);

	let isSidebarOpen = $derived(sidebar.open);

	afterNavigate(() => {
		if (sidebar.isMobile) {
			sidebar.toggle();
		}
	});
</script>

<Sidebar.Group>
	<Sidebar.Menu>
		{#each routes as route (route.title)}
			{#if route.allowedRoles.includes(user.role)}
				<Collapsible.Root class="group/collapsible" open={route.initialOpen}>
					{#snippet child({ props })}
						<Sidebar.MenuItem {...props}>
							<Collapsible.Trigger
								onmouseover={async () => {
									if (!route.nested?.length || !isSidebarOpen) {
										if (route.disablePrefetch) {
											return;
										}

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
										<span>{route.title}</span>
										{#if route?.nested?.length}
											<Icon
												icon="tabler:chevron-right"
												class="ml-auto size-6 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
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
																		<a
																			data-sveltekit-preload-data={subItem.disablePrefetch
																				? 'off'
																				: 'hover'}
																			href={subItem.href}
																			{...props}
																		>
																			{#if subItem.icon}
																				<Icon icon={subItem.icon} class="size-6" />
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
</Sidebar.Group>
