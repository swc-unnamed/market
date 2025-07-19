<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Input } from '$lib/components/ui/input';
	import Icon from '@iconify/svelte';
	import { goto, preloadData } from '$app/navigation';

	let { data } = $props();

	let users = $derived(data.users);
	let filteredUsers = $derived(users);
	let searchQuery = $state('');

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
	}

	function getStatusVariant(role: string) {
		switch (role) {
			case 'Developer':
				return 'default';
			case 'Tzar':
				return 'destructive';
			case 'User':
				return 'secondary';
			default:
				return 'outline';
		}
	}

	$effect(() => {
		if (searchQuery) {
			const lowerQuery = searchQuery.toLowerCase();
			filteredUsers = users.filter(
				(user) =>
					user.username.toLowerCase().includes(lowerQuery) ||
					user.profile?.displayName?.toLowerCase().includes(lowerQuery)
			);
		} else {
			filteredUsers = users;
		}
	});
</script>

<PageWrapper title="Users" description="Manage and view all users in the platform">
	<div class="grid grid-cols-1 gap-3">
		<!-- Stats Cards -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Total Users</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{users?.length || 0}</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Patrons</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">
						{users?.filter((u) => u.role === 'Patron').length || 0}
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Auctioneers</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">
						{users?.filter((u) => u.role === 'Auctioneer').length || 0}
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Developers</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">
						{users?.filter((u) => u.role === 'Developer').length || 0}
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>Filter Users</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-2">
				<Input bind:value={searchQuery} />
				<p class="text-muted-foreground text-sm">Search by Username or Display Name</p>
			</Card.Content>
		</Card.Root>

		<!-- Data Table -->
		<Card.Root>
			<Card.Content class="p-0">
				<Table.Root>
					<Table.Header>
						<Table.Row class="hover:bg-transparent">
							<Table.Head>User</Table.Head>
							<Table.Head>Username</Table.Head>
							<Table.Head>Role</Table.Head>
							<Table.Head>Reputation</Table.Head>
							<Table.Head>Last Login</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if filteredUsers && filteredUsers.length > 0}
							{#each filteredUsers as user, index}
								<Table.Row
									class="group hover:cursor-pointer"
									onmouseenter={async () => {
										await preloadData(`/admin/users/${user.id}`);
									}}
									onclick={async () => {
										await goto(`/admin/users/${user.id}`);
									}}
								>
									<Table.Cell>
										<div class="flex items-center gap-3">
											<Avatar.Root class="h-8 w-8">
												<Avatar.Image
													src={user.profile?.avatar}
													alt={user.profile?.displayName || user.username}
												/>
												<Avatar.Fallback class="text-xs">
													{getInitials(user.profile?.displayName || user.username)}
												</Avatar.Fallback>
											</Avatar.Root>
											<div>
												<div class="text-sm font-medium">
													{user.profile?.displayName || 'Unnamed User'}
												</div>
												<div class="text-muted-foreground text-xs">
													{user.id}
												</div>
											</div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="flex items-center gap-2">
											<span class="text-sm">{user.username}</span>
										</div>
									</Table.Cell>
									<Table.Cell>
										<Badge variant={getStatusVariant(user.role)} class="capitalize">
											{user.role}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										<div class="flex items-center gap-2">
											<span class="text-sm font-semibold text-amber-600">
												{user.profile?.reputation || 0}
											</span>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="flex items-center gap-2 text-sm text-gray-600">
											{user.lastLogin ? formatDate(user.lastLogin.toString()) : 'Never'}
										</div>
									</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
