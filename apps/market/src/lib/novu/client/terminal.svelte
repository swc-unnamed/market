<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { type TerminalContext, TerminalContextKey } from '$lib/context/terminal.context';
	import { type UserContext, UserContextKey } from '$lib/context/user.context';
	import { getContext, onMount } from 'svelte';
	import { getNovuClient } from './client';
	import { Terminal } from '@lucide/svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { formatDistance } from 'date-fns';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import type { ListNotificationsResponse, Notification, Novu } from '@novu/js';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';

	const userContext = getContext<UserContext>(UserContextKey);
	const terminalContext = getContext<TerminalContext>(TerminalContextKey);

	let novu: Novu | null = null;

	let unreadCount = $state(0);
	let terminalOpen = $state(false);
	let notifications = $state<Notification[]>([]);
	let terminalInitialized = $state(false);

	// $inspect(notifications, terminalInitialized);

	onMount(async () => {
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
			console.log('new unread notifications count =>', data);

			unreadCount = data.result;
		});

		novu.on('notification.read.resolved', (e) => {
			console.log('Notification marked as read =>', e);
		});

		novu.on('notifications.unseen_count_changed', (data) => {
			console.log('New unseen notifications count =>', data);
		});

		novu.on('notifications.count.resolved', (data) => {
			console.log('New notifications count =>', data);
		});

		novu.on('notification.read.pending', (e) => {
			console.log('Notification read pending =>', e);
		});

		if (notifs.data) {
			notifications = notifs.data.notifications || [];
		} else {
			console.error('Failed to fetch notifications:', notifs);
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

<div class="">
	<button class="hover:bg-secondary p-1 hover:rounded-sm" onclick={() => (terminalOpen = true)}>
		<div class="flex items-center">
			<Terminal class="-mt-0.5 size-6" />
			{#if unreadCount > 0}
				{#if unreadCount > 99}
					<Badge variant="outline">99+</Badge>
				{:else}
					<Badge variant="outline">
						{unreadCount}
					</Badge>
				{/if}
			{/if}
		</div>
	</button>

	<Sheet.Root bind:open={terminalOpen}>
		<Sheet.Content>
			<Sheet.Header>
				<Sheet.Title>
					<div class="flex items-center justify-between">
						<h3>Terminal</h3>
					</div>
				</Sheet.Title>
			</Sheet.Header>
			<div class="overflow-scroll rounded-lg px-3">
				<Tabs.Root>
					<Tabs.List class="w-full">
						<Tabs.Trigger value="all">All Notifcations</Tabs.Trigger>
						<Tabs.Trigger value="auction_house">Auction House</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="all">
						{#if notifications.length > 0}
							<div class="grid grid-cols-1 gap-1">
								{#if notifications}
									{#each notifications as notif}
										<div class="border-1 rounded-lg p-2">
											<div class="flex flex-col gap-1">
												<h4>{notif.subject}</h4>
												<p class="text-sm">{notif.body}</p>
												<div class="flex items-center justify-between">
													<span class="text-muted-foreground text-xs">
														{formatDistance(notif.createdAt, new Date(), {
															addSuffix: true,
															includeSeconds: true
														})}
													</span>
													<Button
														size="sm"
														variant="ghost"
														onclick={async () => {
															await markAsRead(notif.id);
														}}>Dismiss</Button
													>
												</div>
											</div>
										</div>
									{/each}
								{/if}
							</div>
						{:else}
							<Alert.Root>
								<Alert.Description>You're all caught up! No new notifications.</Alert.Description>
							</Alert.Root>
						{/if}
					</Tabs.Content>
					<Tabs.Content value="auction_house">
						<div class="border-1 rounded-lg p-2">
							<div class="flex flex-col gap-1">
								<h3>Subject</h3>
								<p>This is the body of the payload.</p>
								<span class="text-xs">
									{formatDistance(new Date(), new Date(), {
										addSuffix: true,
										includeSeconds: true
									})}
								</span>
							</div>
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>
