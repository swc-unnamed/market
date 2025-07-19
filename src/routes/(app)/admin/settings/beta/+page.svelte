<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { invalidate } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { format } from 'date-fns';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { toast } from 'svelte-sonner';
	import { SwcTimestamp } from 'swcombine.js';
	import { enhance } from '$app/forms';

	const { data } = $props();
	let deleteDialogOpen = $state(false);
	let addDialogOpen = $state(false);
	const betaUsers = $derived.by(() => data.betaUsers || []);
</script>

<PageWrapper
	title="Beta Access"
	description="Grant users access to this beta environment. This is only in select environments and has no place on the production site."
	breadcrumb={[{ title: 'Administration' }, { title: 'Settings' }]}
>
	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold">Beta Access</h2>
				<Dialog.Root bind:open={addDialogOpen}>
					<Dialog.Trigger>
						<Button variant="outline" size="sm" onclick={() => (addDialogOpen = true)}>
							<Icon icon="tabler:plus" />
							Add User
						</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Content>
							<Dialog.Header>
								<form
									method="post"
									action="?/addUser"
									use:enhance={() => {
										return async () => {
											addDialogOpen = false;
											await invalidate('admin:settings:beta-users');
											toast.success('Success', {
												description: 'User has been added. They can now access the beta.'
											});
										};
									}}
								>
									<Dialog.Title>Add Beta User Access</Dialog.Title>
									<div class="grid gap-2">
										<Label>Combine Name</Label>
										<Input name="handle" />
										<p class="text-muted-foreground text-sm">
											This must match exactly to their Combine name. Any deviation will result in
											the user not being able to access the beta.
										</p>
									</div>
									<div class="flex items-center justify-end gap-3">
										<Button variant="outline" type="submit">Add Access</Button>
									</div>
								</form>
							</Dialog.Header>
						</Dialog.Content>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">ID</Table.Head>
						<Table.Head>Username</Table.Head>
						<Table.Head>Created At</Table.Head>
						<Table.Head></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each betaUsers as user}
						<Table.Row>
							<Table.Cell>
								<div class="font-mono text-xs">{user.id}</div>
							</Table.Cell>
							<Table.Cell>
								<div class="font-medium">{user.username}</div>
							</Table.Cell>
							<Table.Cell>
								<div class="gap- flex flex-col">
									{SwcTimestamp.fromDate(new Date(user.createdAt)).toString('{yy}.{dd}')}
									<span class="text-xs">
										{format(new Date(user.createdAt), 'MM/dd/yyyy')}
									</span>
								</div>
							</Table.Cell>
							<Table.Cell>
								<Dialog.Root bind:open={deleteDialogOpen}>
									<Dialog.Trigger>
										{#snippet child({ props })}
											<Button size="sm" variant="outline" class="text-red-600" {...props}>
												<Icon icon="tabler:trash-x" />
											</Button>
										{/snippet}
									</Dialog.Trigger>
									<Dialog.Content>
										<Dialog.Title>Remove User</Dialog.Title>
										<Dialog.Description>
											Are you sure you want to remove this user from the beta access list? If you
											do, they will no longer be able to access the current environment. You can
											always add them back later and they will retain their data.
										</Dialog.Description>
										<Dialog.Footer>
											<form
												method="post"
												action="?/deleteUser"
												use:enhance={() => {
													return async () => {
														deleteDialogOpen = false;
														await invalidate('admin:settings:beta-users');
														toast.success("User's access has been revoked.");
													};
												}}
											>
												<input type="hidden" name="userId" value={user.id} />
												<AlertDialog.Action type="submit">Remove</AlertDialog.Action>
											</form>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</PageWrapper>
