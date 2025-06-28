<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Avatar from '$lib/components/ui/avatar';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select/index.js';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { Checkbox } from '$lib/components/ui/checkbox';

	let { data } = $props();
	let user = $derived(data.record);
	let editDialogOpen = $state(false);

	async function toggleBanStatus() {
		try {
			toast.success(user.banned ? 'User unbanned' : 'User banned');
		} catch (error) {
			console.error('Failed to update ban status:', error);
			toast.error('Failed to update ban status');
		}
	}

	const { form, enhance } = superForm(data.updateForm, {
		dataType: 'json',
		onSubmit: () => {
			editDialogOpen = false;
		},
		onResult: async ({ result }) => {
			if (result.type == 'success') {
				toast.success('User updated');
			} else {
				toast.error('Error Updating User', {
					description: 'Something went wrong while updating the user. Please try again.'
				});
			}
		}
	});
</script>

<PageWrapper
	title={user.profile?.displayName}
	breadcrumb={[
		{
			title: 'Administration'
		},
		{ title: 'Users', href: '/admin/users' }
	]}
>
	<div class="grid gap-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>
					<div class="flex items-center justify-between">
						<span>User Profile</span>
						<div class="flex items-center gap-2">
							<Dialog.Root bind:open={editDialogOpen}>
								<Dialog.Trigger>
									<Tooltip.Root>
										<Tooltip.Trigger>
											<Button variant="outline">
												<Icon icon="lucide:edit" class="h-4 w-4" />
											</Button>
										</Tooltip.Trigger>
										<Tooltip.Content>
											<p>Edit User</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</Dialog.Trigger>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>
											<div class="flex flex-col">
												<span>Modify {user.profile?.displayName} </span>
												<span class="text-muted-foreground text-sm">({user.username})</span>
											</div>
										</Dialog.Title>
									</Dialog.Header>
									<Dialog.Description>Modify the user profile information</Dialog.Description>
									<form method="POST" action="?/updateUser" use:enhance>
										<div class="grid grid-cols-1 gap-4">
											<div class="grid grid-cols-1 gap-2">
												<Label>Display Name</Label>
												<Input bind:value={$form.displayName} />
											</div>

											<div class="grid grid-cols-1 gap-2">
												<Label>Select Role</Label>
												<Select.Root type="single" bind:value={$form.role}>
													<Select.Trigger>
														{$form.role}
													</Select.Trigger>
													<Select.Content>
														<Select.Item value={'Patron'}>Patron</Select.Item>
														<Select.Item value={'Auctioneer'}>Auctioneer</Select.Item>
														<Select.Item value={'Developer'}>Developer</Select.Item>
														<Select.Item value={'Tzar'}>Tzar</Select.Item>
													</Select.Content>
												</Select.Root>
											</div>

											<div class="grid grid-cols-1 gap-2">
												<div class="ml-1 flex flex-row items-center gap-3">
													<Checkbox bind:checked={$form.banned} />
													<Label>Ban User</Label>
												</div>

												{#if $form.banned}
													<Label>Ban Reason</Label>
													<Input bind:value={$form.bannedReason} />
												{/if}
											</div>
										</div>
										<Dialog.Footer>
											<Button variant="outline" type="submit">Save</Button>
										</Dialog.Footer>
									</form>
								</Dialog.Content>
							</Dialog.Root>
						</div>
					</div>
				</Card.Title>
				<Card.Description>View and manage user account details</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="mb-6 flex items-center space-x-4">
					<Avatar.Root class="h-20 w-20">
						<Avatar.Image src={user.profile?.avatar} />
						<Avatar.Fallback>
							{user.profile?.displayName?.[0] ?? ''}
						</Avatar.Fallback>
					</Avatar.Root>
					<div>
						<h3 class="text-2xl font-semibold">
							{user.profile?.displayName}
						</h3>
						<p class="text-muted-foreground">
							@{user.username}
						</p>
					</div>
				</div>

				<div class="grid gap-4">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<h4 class="mb-2 font-medium">Role</h4>
							<p class="text-muted-foreground">{user.role}</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">Reputation</h4>
							<div class="flex gap-4">
								<div class="flex flex-row items-center gap-1">
									<Icon class="text-primary h-4 w-4" icon="lucide:stars" />
									<span>{user.profile?.reputation}</span>
								</div>
							</div>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<h4 class="mb-2 font-medium">Discord Information</h4>
							{#if user.discordId || user.discordUsername}
								<div class="space-y-1">
									<p class="text-muted-foreground text-sm">
										Discord ID: <span class="font-mono">{user.discordId}</span>
									</p>
									<p class="text-muted-foreground text-sm">
										Discord Username: {user.discordUsername}
									</p>
								</div>
							{:else}
								<p class="text-muted-foreground text-sm">No Discord account linked</p>
							{/if}
						</div>
						<div>
							<h4 class="mb-2 font-medium">Ban Status</h4>
							<div class="flex items-center gap-2">
								{#if user.banned}
									<div class="space-y-1">
										<p class="text-sm font-medium text-red-500">Account Banned</p>
										{#if user.bannedDate}
											<p class="text-muted-foreground text-sm">
												Banned on: {new Date(user.bannedDate).toLocaleDateString()}
											</p>
										{/if}
										{#if user.bannedReason}
											<p class="text-muted-foreground text-sm">
												Reason: {user.bannedReason}
											</p>
										{/if}
									</div>
								{:else}
									<p class="text-sm text-green-500">Account Active</p>
								{/if}
							</div>
						</div>
					</div>

					<div>
						<h4 class="mb-2 font-medium">Combine Scopes</h4>
						{#if user.combineScopes?.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each user.combineScopes as scope}
									<span class="bg-primary/10 text-primary rounded px-2 py-1 text-sm">
										{scope}
									</span>
								{/each}
							</div>
						{:else}
							<p class="text-muted-foreground text-sm">No combine scopes granted</p>
						{/if}
					</div>

					<div>
						<h4 class="mb-2 font-medium">Owned Organizations</h4>
						<p class="text-muted-foreground">Not yet implemented</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
