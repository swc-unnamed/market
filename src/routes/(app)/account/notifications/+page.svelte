<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import { SwcTimestamp } from 'swcombine.js';
	import { cn } from '$lib/utils';
	import { beforeNavigate } from '$app/navigation';
	import ServerPagination from '$lib/components/custom/layout/server-pagination.svelte';

	let { data } = $props();
	let notificationIds = $derived(data.notifications.map((n) => n.id));

	async function markNotificationsAsRead() {
		const resp = await fetch(`/api/account/notifications`, {
			method: 'POST',
			body: JSON.stringify({
				notificationIds: notificationIds
			})
		});

		if (!resp.ok) {
			console.error('Failed to mark notifications as read');
		}
	}

	beforeNavigate(({ type }) => {
		console.log(type);
		if (type === 'goto') {
			markNotificationsAsRead();
		}

		if (type === 'leave') {
			markNotificationsAsRead();
		}
	});
</script>

<PageWrapper title="Notifications Terminal">
	<Card.Root>
		<Card.Content class="grid grid-cols-1 gap-2">
			<ServerPagination
				meta={{
					maxPerPage: data.meta.maxPerPage,
					page: data.meta.page,
					pageSize: data.meta.pageSize,
					totalPages: data.meta.totalPages
				}}
			/>
			<Table.Root>
				<Table.Caption>
					<ServerPagination
						meta={{
							maxPerPage: data.meta.maxPerPage,
							page: data.meta.page,
							pageSize: data.meta.pageSize,
							totalPages: data.meta.totalPages
						}}
					/>
				</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Cell>Category</Table.Cell>
						<Table.Cell>Date</Table.Cell>
						<Table.Cell>Message</Table.Cell>
						<Table.Cell>View</Table.Cell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{#if data.notifications}
						{#each data.notifications as notification}
							<Table.Row class={cn(notification.read ? 'text-muted-foreground' : '')}>
								<Table.Cell class="w-32 uppercase">{notification.category}</Table.Cell>
								<Table.Cell class="w-64">
									{SwcTimestamp.fromDate(notification.createdAt).toString()}
								</Table.Cell>
								<Table.Cell class="text-wrap">{notification.message}</Table.Cell>
								<Table.Cell class="w-32">
									{#if notification.href}
										<a href={notification.href} rel="noopener noreferrer"> View </a>
									{/if}
								</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</PageWrapper>
