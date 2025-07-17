<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { getContext, type ComponentProps } from 'svelte';
	import * as DropdownMenu from '../ui/dropdown-menu';
	import Icon from '@iconify/svelte';
	import * as Avatar from '../ui/avatar';
	import * as Alert from '../ui/alert';
	import { goto, preloadData } from '$app/navigation';
	import AppNav from './app-nav.svelte';
	import AppOrgSwitcher from './app-org-switcher.svelte';
	import { toast } from 'svelte-sonner';
	import { type UserContext, UserContextKey } from '$lib/context/user.context';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	const userContext = getContext<UserContext>(UserContextKey);
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<div class="flex items-center gap-2">
			<Avatar.Root class="ml-1 h-12 w-12">
				<Avatar.Image src="/images/uim-17.png" />
				<Avatar.Fallback>
					<Icon icon="lucide:arrow-big-up-dash" />
				</Avatar.Fallback>
			</Avatar.Root>
			<span class="truncate text-center text-xl font-semibold leading-none"> Unnamed Market </span>
		</div>
		<Sidebar.Separator />
	</Sidebar.Header>

	<Sidebar.Content>
		<AppNav />
	</Sidebar.Content>

	<Sidebar.Footer>
		<Alert.Root class="border-red-600 shadow-lg">
			<Alert.Title>Beta Alert</Alert.Title>
			<Alert.Description>
				We are still in beta, albeit a public beta, so expect some bugs and issues. If you find bugs
				or have feedback, please let us know in the Discord server.
			</Alert.Description>
		</Alert.Root>
		<AppOrgSwitcher />
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								size="lg"
								{...props}
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div class="flex w-full flex-row items-center justify-between">
									<div class="flex w-full flex-row items-center gap-3">
										<Avatar.Root class="h-8 w-8">
											<Avatar.Image src={userContext.profile.avatar} />
											<Avatar.Fallback>{userContext.profile.displayName[0]}</Avatar.Fallback>
										</Avatar.Root>
										<div class="flex flex-col gap-1">
											<span>{userContext.profile.displayName}</span>
											<div class="text-muted-foreground flex gap-2 text-xs">
												<div class="flex flex-row items-center gap-1">
													{#if userContext.profile.reputation >= 0n}
														<Icon class="text-primary h-4 w-4" icon="lucide:stars" />
														<span>{userContext.profile.reputation}</span>
													{:else}
														<Icon class="h-4 w-4 text-red-600" icon="lucide:stars" />
														<span>{userContext.profile.reputation}</span>
													{/if}
												</div>
											</div>
										</div>
									</div>
									<Icon icon="lucide:chevrons-up-down" />
								</div>
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-48">
						<DropdownMenu.Item
							onmouseenter={async () => await preloadData('/account')}
							onclick={async () => await goto('/account')}
						>
							<span>Account</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => toast("Can't log you out yet lol")}>
							<span>Sign out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
