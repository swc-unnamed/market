<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { cn } from '$lib/utils.js';
	import ServerPagination from '$lib/components/custom/layout/server-pagination.svelte';
	import ServerSearch from '$lib/components/custom/layout/server-search.svelte';
	import { goto, preloadData } from '$app/navigation';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { SwcTimestamp } from 'swcombine.js';
	import { enhance } from '$app/forms';
	let { data } = $props();

	let meta = $derived(data.meta);
	let records = $derived(data.records);

	let newBetaUserDialogOpen = $state(true);

	let { searchTerm }: { searchTerm: string } = $state({ searchTerm: '' });
</script>

<PageWrapper title="Access Control">
	<div class="grid grid-cols-1 gap-3">
		<div class="mt-3 flex flex-row justify-end">
			<div class="w-full">
				<ServerSearch {searchTerm} originalData={data} />
			</div>
		</div>

		<Tabs.Root value="users">
			<Tabs.List>
				<Tabs.Trigger value="users">Users</Tabs.Trigger>
				{#if data.environment !== 'production'}
					<Tabs.Trigger value="beta">Beta Access</Tabs.Trigger>
				{/if}
			</Tabs.List>
			<Tabs.Content value="users">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-12"></Table.Head>
							<Table.Head class="w-64">Name</Table.Head>
							<Table.Head>Role</Table.Head>
							<Table.Head>Status</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Caption>
						<ServerPagination {meta} />
					</Table.Caption>
					<Table.Body>
						{#each records as us}
							<Table.Row
								class="hover:cursor-pointer"
								onmousemove={async () => {
									await preloadData(`/settings/access-control/${us.id}`);
								}}
								onclick={async () => {
									await goto(`/settings/access-control/${us.id}`);
								}}
							>
								<Table.Cell>
									<Avatar.Root>
										<Avatar.Image src={us.avatar} />
										<Avatar.Fallback>{us.name[0]}{us.name[1]}</Avatar.Fallback>
									</Avatar.Root>
								</Table.Cell>
								<Table.Cell class="text-wrap">{us.name}</Table.Cell>
								<Table.Cell>{us.role}</Table.Cell>
								<Table.Cell class={cn(us.banned ? 'text-destructive' : 'text-green-500')}>
									{us.banned ? 'Banned' : 'Active'}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Tabs.Content>

			<Tabs.Content value="beta">
				<div class="flex">
					<Dialog.Root>
						<Dialog.Trigger class={buttonVariants({ variant: 'action' })}>
							Add Access
						</Dialog.Trigger>
						<Dialog.Content>
							<form action="?/addBetaUser" method="post" use:enhance>
								<Dialog.Header>
									<Dialog.Title>Beta Access Grant</Dialog.Title>
									<Dialog.Description>
										<div class="grid grid-cols-1 gap-2">
											<Label>Name</Label>
											<Input name="name" />
											<span class="mt-3 text-xs text-muted-foreground">
												This will grant access to the beta version of the app. The name must match
												exactly with the Combine.
											</span>
										</div>
									</Dialog.Description>
								</Dialog.Header>
								<Dialog.Footer>
									<Button variant="action" type="submit">Grant Access</Button>
								</Dialog.Footer>
							</form>
						</Dialog.Content>
					</Dialog.Root>
				</div>

				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Cell>Name</Table.Cell>
							<Table.Cell>UID</Table.Cell>
							<Table.Cell>Added On</Table.Cell>
							<Table.Cell></Table.Cell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.betaAccess as betaUsers}
							<Table.Row>
								<Table.Cell>{betaUsers.name}</Table.Cell>
								<Table.Cell>{betaUsers.uid}</Table.Cell>
								<Table.Cell>{SwcTimestamp.fromDate(betaUsers.createdAt).toString()}</Table.Cell>
								<Table.Cell>
									<form method="post" action={`?/deleteBetaUser&id=${betaUsers.id}`} use:enhance>
										<Button variant="action" class="text-danger" type="submit">
											Remove Access
										</Button>
									</form>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</PageWrapper>
