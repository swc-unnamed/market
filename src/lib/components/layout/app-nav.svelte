<script lang="ts">
	import { afterNavigate, goto, preloadData } from '$app/navigation';
	import { getOrganizationRoutes, getAdminRoutes, type Route } from './routes';
	import Icon from '@iconify/svelte';
	import { Group } from '../ui/command';
	import { useSidebar } from '../ui/sidebar';
	import * as Sidebar from '../ui/sidebar';
	import * as Collapsible from '../ui/collapsible';
	import { GlobalPatronAccessPolicy } from '$lib/utils/access-policies';
	import { page } from '$app/state';
	import { getContext } from 'svelte';
	import { type UserContext, UserContextKey } from '$lib/context/user.context';

	const userContext = getContext<UserContext>(UserContextKey);

	const isOrgContext = $derived(userContext.profile.activeOrganizationId !== null);

	// const orgContext = $derived(userState.profile.activeOrganizationMembership?.organization);
	const orgContext = $derived(null);

	const globalRoutes: Route[] = [
		{
			title: 'Auction House',
			icon: 'lucide:blocks',
			href: '/auction-house/dashboard',
			accessPolicy: GlobalPatronAccessPolicy
		},
		// {
		//   title: 'Holochain',
		//   icon: 'lucide:package-search',
		//   href: '/holochain',
		//   nested: [],
		//   accessPolicy: GlobalPatronAccessPolicy
		// },
		// {
		//   title: 'Marketplace',
		//   icon: 'lucide:chart-no-axes-combined',
		//   href: '/marketplace',
		//   accessPolicy: GlobalPatronAccessPolicy
		// },
		{
			title: 'Database',
			icon: 'lucide:database',
			href: '/db',
			nested: [],
			accessPolicy: GlobalPatronAccessPolicy
		}
	];

	const sidebar = useSidebar();
	let isSidebarOpen = $derived(sidebar.open);

	afterNavigate(() => {
		if (sidebar.isMobile) {
			sidebar.toggle();
		}
	});
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Global Terminal</Sidebar.GroupLabel>
	<Sidebar.Menu>
		<!-- <Sidebar.MenuItem>
			<Sidebar.MenuButton
				onclick={async () => await goto('/dashboard')}
				onmouseenter={async () => preloadData('/dashboard')}
				class={page.url.pathname.startsWith('/dashboard') ? 'bg-secondary' : ''}
			>
				<div class="flex items-center gap-3">
					<Icon icon="lucide:layout-dashboard" class="h-4 w-4" />
					<p>Dashboard</p>
				</div>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem> -->
		{#each globalRoutes as route (route.title)}
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
								<Sidebar.MenuButton
									{...props}
									class={page.url.pathname.startsWith(route.href) ? 'bg-secondary' : ''}
								>
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
													<Sidebar.MenuSubItem>
														<Sidebar.MenuButton
															onmouseenter={async () => await preloadData(subItem.href)}
															onclick={async () => await goto(subItem.href)}
														>
															{#if subItem.icon}
																<Icon icon={subItem.icon} class="size-6" />
															{/if}
															<span>{subItem.title}</span>
														</Sidebar.MenuButton>
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

<!-- {#if isOrgContext && orgContext}
	{@const orgRoutes = getOrganizationRoutes(orgContext.slug)}
	<Sidebar.Group>
		<Sidebar.GroupLabel>Organization</Sidebar.GroupLabel>
		<Sidebar.Menu>
			{#each orgRoutes as route (route.title)}
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
														<Sidebar.MenuSubItem>
															<Sidebar.MenuButton
																onmouseenter={async () => await preloadData(subItem.href)}
																onclick={async () => await goto(subItem.href)}
															>
																{#if subItem.icon}
																	<Icon icon={subItem.icon} class="size-6" />
																{/if}
																<span>{subItem.title}</span>
															</Sidebar.MenuButton>
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
{/if} -->

{#if userContext.role == 'Developer' || userContext.role == 'Tzar'}
	<Sidebar.Group>
		<Sidebar.GroupLabel>Admin</Sidebar.GroupLabel>
		<Sidebar.Menu>
			{@const adminRoutes = getAdminRoutes()}
			{#each adminRoutes as route (route.title)}
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
														<Sidebar.MenuSubItem>
															<Sidebar.MenuButton
																onmouseenter={async () => await preloadData(subItem.href)}
																onclick={async () => await goto(subItem.href)}
															>
																{#if subItem.icon}
																	<Icon icon={subItem.icon} class="size-6" />
																{/if}
																<span>{subItem.title}</span>
															</Sidebar.MenuButton>
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
{/if}
