<script lang="ts">
	import type { Route } from '$lib/consts/layout/route';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import Icon from '@iconify/svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { goto, preloadData } from '$app/navigation';
	import { getContext } from 'svelte';
	import {
		PatronPermissionPolicy,
		MagistratePermissionPolicy
	} from '$lib/consts/permission-policies';
	import type { UserContext } from '$lib/stores';
	import { USER_CONTEXT } from '$lib/stores/contexts';

	const routes: Route[] = [
		{
			title: 'Home',
			href: '/home',
			icon: 'mdi:home',
			nested: [],
			allowedRoles: ['patron', 'auctioneer', 'magistrate', 'holochain_architect', 'market_tzar']
		},
		{
			title: 'Auctions',
			href: '/auctions',
			icon: 'tabler:gavel',
			allowedRoles: ['patron', 'auctioneer', 'magistrate', 'holochain_architect', 'market_tzar'],
			nested: [
				{
					title: 'Available Auctions',
					href: '/auctions',
					icon: 'tabler:gavel',
					allowedRoles: ['patron', 'auctioneer', 'magistrate', 'holochain_architect', 'market_tzar']
				},
				{
					title: 'New Auction',
					href: '/auctions/new',
					icon: 'mdi:invoice-line-items',
					allowedRoles: ['auctioneer', 'magistrate', 'holochain_architect', 'market_tzar']
				},
				{
					title: 'New Listing',
					href: '/auctions/listings/new',
					icon: 'tabler:circle-plus',
					allowedRoles: [
						'patron',
						'auctioneer',
						'magistrate',
						'holochain_architect',
						'market_tzar'
					],
					disablePrefetch: true
				},
				{
					title: 'Draft Listings',
					href: '/auctions/draft-listings',
					icon: 'tabler:circle-dashed',
					allowedRoles: PatronPermissionPolicy
				}
			]
		},
		{
			title: 'Entity Database',
			href: '/entities',
			icon: 'mdi:database',
			nested: [],
			allowedRoles: ['patron', 'auctioneer', 'magistrate', 'holochain_architect', 'market_tzar']
		}
	];

	const sidebar = useSidebar();

	const user = getContext<UserContext>(USER_CONTEXT);

	let isSidebarOpen = $derived(sidebar.open);
</script>

<Sidebar.Group>
	<Sidebar.Menu>
		{#each routes as route (route.title)}
			{#if route.allowedRoles.includes(user.role)}
				<Collapsible.Root class="group/collapsible">
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
</Sidebar.Group>
