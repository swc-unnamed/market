<script lang="ts">
	import * as Sidebar from '../ui/sidebar';
	import * as Popover from '../ui/popover';
	import * as HoverCard from '../ui/hover-card';
	import Icon from '@iconify/svelte';
	import * as Avatar from '../ui/avatar';
	import AppOrganizationCard from './app-organization-card.svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '../ui/button';
	import { invalidateAll } from '$app/navigation';
	import { getContext } from 'svelte';
	import { UserContextKey, type UserContext } from '$lib/context/user.context';

	const userContext = getContext<UserContext>(UserContextKey);

	const orgs = $derived(userContext.profile.memberships);

	const activeOrg = $derived(userContext.profile.activeOrganization);

	let popoverOpen = $state(false);
	const sidebar = Sidebar.useSidebar();

	async function updateOrgContext(id: string) {
		popoverOpen = false;
		try {
			const resp = await fetch('/api/profile', {
				body: JSON.stringify({
					activeOrganizationMembershipId: id
				}),
				method: 'POST'
			});

			if (!resp.ok) {
				toast.error('Failed to update your active Organization!');
				console.error('Failed to update active org membership', resp);
				return;
			}

			const data = await resp.json();

			toast.success(data.message);

			await invalidateAll();
		} catch (e) {
			toast.error('Failed to update org context');
			console.error(e);
		}
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Popover.Root bind:open={popoverOpen}>
			<HoverCard.Root>
				<HoverCard.Trigger class="w-full">
					<Popover.Trigger disabled>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								{...props}
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-secondary"
							>
								<div class="flex w-full items-center justify-between">
									{#if activeOrg}
										<AppOrganizationCard
											id={activeOrg.id}
											name={activeOrg.name}
											slug={activeOrg.slug}
											logoId={null}
											logoUrl={activeOrg.logoUrl}
										/>
									{:else}
										<div class="flex items-center gap-2">
											<div class="grid flex-1 text-left text-sm leading-tight">
												<span class="truncate font-semibold"> Select Organization </span>
											</div>
										</div>
									{/if}
									<Icon icon="lucide:chevrons-up-down" class="ml-auto" />
								</div>
							</Sidebar.MenuButton>
						{/snippet}
					</Popover.Trigger>
				</HoverCard.Trigger>

				<HoverCard.Content>
					<p class="text-sm">
						Currently disabled until we finalize the design and functionality of how Organizations
						will work on the platform.
					</p>
				</HoverCard.Content>
			</HoverCard.Root>

			<Popover.Content
				class="w-[var(--bits-dropdown-menu-anchor-width)] min-w-96 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<div class="flex w-full flex-col gap-2">
					<div class="flex items-center justify-between">
						<p class="text-lg">Organziation Selection</p>
						<div>
							<Button
								size="sm"
								variant="ghost"
								href="/account/organizations/new"
								onclick={() => (popoverOpen = false)}
							>
								<Icon icon="lucide:plus" class="mr-2" />
								<span class="text-sm">New Org</span>
							</Button>
						</div>
					</div>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="hover:bg-sidebar-accent flex w-full flex-row items-center gap-2 rounded-lg p-2 text-left"
						onclick={() => updateOrgContext('')}
					>
						<Avatar.Root class="bg-transparent">
							<Avatar.Image src={userContext.profile.avatar} />
							<Avatar.Fallback>{userContext.profile.displayName[0]}</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex flex-col">
							<span class="truncate font-semibold"> Personal Account </span>
							<span class="text-muted-foreground text-xs">
								Your personal account. For personal things.
							</span>
						</div>
					</div>

					{#each orgs as membership (membership.id)}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="hover:bg-sidebar-accent flex w-full flex-row items-center gap-2 rounded-lg p-2 text-left"
							onclick={() => updateOrgContext(membership.id)}
						>
							<Avatar.Root class="bg-transparent">
								<Avatar.Image
									src={membership.organization.logoId
										? membership.organization.logoId
										: membership.organization.logoUrl
											? membership.organization.logoUrl
											: ''}
								/>
								<!-- <Avatar.Image src={`/api/storage/${membership.organization.logoId}`} /> -->
								<Avatar.Fallback>{membership.organization.name[0]}</Avatar.Fallback>
							</Avatar.Root>
							<div class="flex flex-col">
								<span class="truncate font-semibold">{membership.organization.name}</span>
								<span class="text-muted-foreground text-xs">
									{membership.organization.role}
								</span>
							</div>
						</div>
					{/each}
				</div>
			</Popover.Content>
		</Popover.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
