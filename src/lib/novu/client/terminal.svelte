<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { type TerminalContext, TerminalContextKey } from '$lib/context/terminal.context';
	import { type UserContext, UserContextKey } from '$lib/context/user.context';
	import { getContext, onMount } from 'svelte';
	import { getNovuClient } from './client';
	import { Check, Circle, Option, Settings, Terminal } from '@lucide/svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { formatDistance } from 'date-fns';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import type { Notification, Novu } from '@novu/js';
	import { toast } from 'svelte-sonner';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	const userContext = getContext<UserContext>(UserContextKey);
	const terminalContext = getContext<TerminalContext>(TerminalContextKey);

	let novu: Novu | null = null;

	interface TerminalProps {
		tabs: {
			label: string;
			value: string[];
		}[];
	}

	let { tabs }: TerminalProps = $props();

	let unreadCount = $state(0);
	let terminalOpen = $state(true);
	let notifications = $state<Notification[]>([]);
	let terminalInitialized = $state(false);

	// $inspect(notifications, terminalInitialized);

	onMount(async () => {
		console.log('mounted');

		novu = getNovuClient({
			apiUrl: terminalContext.apiUrl,
			appId: terminalContext.appId,
			subscriberId: userContext.id,
			socketUrl: terminalContext.socketUrl
		});

		if (!novu) {
			console.error('Novu client is not initialized');
			return;
		}

		const notifs = await novu.notifications.list({
			limit: 99,
			archived: false,
			read: false
		});

		unreadCount = notifs.data?.notifications.length || 0;

		novu.on('socket.connect.resolved', () => {
			console.log('🤖 Terminal connected');
			terminalInitialized = true;
		});

		novu.on('notifications.notification_received', (data) => {
			notifications = [data.result, ...notifications];
		});

		novu.on('notifications.unread_count_changed', (data) => {
			unreadCount = data.result;
		});

		novu.on('notification.read.resolved', async (e) => {});

		novu.on('notifications.unseen_count_changed', (data) => {});

		novu.on('notifications.count.resolved', (data) => {});

		if (notifs.data) {
			notifications = notifs.data.notifications || [];
		} else {
			toast.error('Failed to fetch notifications');
		}
	});

	async function markAsRead(id: string) {
		try {
			await novu?.notifications.read({
				notificationId: id
			});

			// Remove the notification from the list
			notifications = notifications.filter((notif) => notif.id !== id);
		} catch (err) {
			console.error('Failed to mark notification as read:', err);
			toast.error('Failed to mark notification as read');
		}
	}
</script>

<div class="md:hidden">
	<a href="/notifications" class="flex items-center">
		<Terminal class="size-6" />
		{#if unreadCount > 0}
			<Badge variant="secondary" class="ml-1">{unreadCount}</Badge>
		{/if}
	</a>
</div>

<div class="hidden md:flex">
	<Popover.Root>
		<Popover.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'sm'
			})}
		>
			<div class="flex items-center">
				<Terminal class="size-6" />
				{#if unreadCount > 0}
					<Badge variant="secondary" class="ml-1">{unreadCount}</Badge>
				{/if}
			</div>
		</Popover.Trigger>
		<Popover.Content
			class="max-h-[600px] w-2/3 overflow-y-auto md:w-[400px]"
			sideOffset={10}
			align="end"
			side="bottom"
		>
			<div class="mb-3 flex items-center justify-between">
				<h3>Terminal</h3>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Settings class="size-6" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Item
								onclick={async () => {
									await novu?.notifications.readAll();
									notifications = [];
									toast.success('All notifications marked as read');
								}}
							>
								Mark all as read
							</DropdownMenu.Item>
							<DropdownMenu.Item
								onclick={async () => {
									await novu?.notifications.archiveAll();
									notifications = [];
									toast.success('All notifications archived');
								}}
							>
								Archive all
							</DropdownMenu.Item>
							<DropdownMenu.Item
								onclick={async () => {
									await novu?.notifications.archiveAllRead();
									notifications = notifications.filter((n) => !n.isRead);
									toast.success('All read notifications archived');
								}}
							>
								Archive read
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<Tabs.Root value={'All'}>
				<Tabs.List class="w-full">
					{#each tabs as tab}
						<Tabs.Trigger value={tab.label}>{tab.label}</Tabs.Trigger>
					{/each}
				</Tabs.List>
				{#each tabs as tab}
					{@const notifs =
						tab.value.length < 1
							? notifications
							: notifications.filter((n) => n.tags?.some((tag) => tab.value.includes(tag)))}
					<Tabs.Content value={tab.label}>
						{#each notifs as notif}
							<div class="group mb-2 mt-2 flex flex-col rounded-md p-2">
								<div class="hover:bg-secondary flex flex-row items-start gap-2 rounded-md">
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="mb-2 grid grid-cols-1 gap-1 p-2 group-hover:cursor-pointer"
										onclick={async () => {
											await markAsRead(notif.id);
										}}
									>
										<div class="flex items-center justify-between">
											<h3 class="text-wrap">{notif.subject}</h3>
											{#if notif.isRead}{:else}
												<Circle class="size-4 text-purple-500" />
											{/if}
										</div>
										<p>{notif.body}</p>
										<p class="text-xs">
											{formatDistance(new Date(notif.createdAt), new Date(), {
												addSuffix: true
											})}
										</p>
									</div>
								</div>

								<div class="mt-2 grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
									{#if notif.primaryAction}
										<Button
											class="hover:cursor-pointer"
											href={notif.primaryAction.redirect?.url}
											target={notif.primaryAction.redirect?.target}
										>
											{notif.primaryAction.label}
										</Button>
									{/if}
									{#if notif.secondaryAction}
										<Button
											class="cursor-pointer"
											variant="outline"
											href={notif.secondaryAction.redirect?.url}
											target={notif.secondaryAction.redirect?.target}
										>
											{notif.secondaryAction.label}
										</Button>
									{/if}
								</div>
							</div>

							<Separator />
						{/each}
					</Tabs.Content>
				{/each}
			</Tabs.Root>
		</Popover.Content>
	</Popover.Root>
</div>
