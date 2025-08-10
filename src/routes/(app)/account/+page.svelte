<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { SwcTimestamp } from 'swcombine.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import { saveSettingsCommand } from './account.remote';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { UserSettings } from '$lib/models/common/user-settings';
	import { Label } from '$lib/components/ui/label';

	let { data } = $props();
	let account = $derived(data.account);
	let settingsState = $state<UserSettings>(data.user.settings);
	$inspect(settingsState);

	async function autosave() {
		const res = await saveSettingsCommand(settingsState);
		if (res.success) {
			toast.success('Settings updated successfully');
		} else {
			toast.error('Failed to update settings');
		}
	}
</script>

<PageWrapper title="Account Overview">
	<Tabs.Root value="overview">
		<Tabs.List>
			<Tabs.Trigger value="overview" class="w-full">Overview</Tabs.Trigger>
			<Tabs.Trigger value="settings" class="w-full">Settings</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="overview">
			<div class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
				<div>
					<Card.Root>
						<Card.Content>
							<div class="flex w-full flex-col items-center justify-center">
								<Avatar.Root class="ml-2 h-[100px] w-[100px]">
									<Avatar.Image src={account?.profile?.avatar} alt={account?.username} />
									<Avatar.Fallback>
										{account?.username?.substring(0, 2).toUpperCase() ?? '??'}
									</Avatar.Fallback>
								</Avatar.Root>
							</div>
							<div class="flex flex-col items-center justify-center">
								<h2>{account?.profile?.displayName}</h2>
								{#if account?.profile?.biography}
									<p>{account.profile.biography}</p>
								{:else}
									<p class="text-muted-foreground text-sm">No bio provided</p>
								{/if}
							</div>
						</Card.Content>
					</Card.Root>
				</div>

				<div>
					<Card.Root>
						<Card.Header>
							<Card.Title>User Fields</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-1">
							<div class="flex items-center justify-between py-2">
								<span class="text-muted-foreground text-sm">User ID</span>
								<span class="text-sm font-medium">{account?.id}</span>
							</div>
							<Separator />
							<div class="flex items-center justify-between py-2">
								<span class="text-muted-foreground text-sm">Username</span>
								<span class="text-sm font-medium">{account?.username}</span>
							</div>
							<Separator />
							<div class="flex items-center justify-between py-2">
								<span class="text-muted-foreground text-sm">Combine ID</span>
								<span class="text-sm font-medium">{account?.combineId}</span>
							</div>
							<Separator />
							{#if account?.discordId}
								<div class="flex items-center justify-between py-2">
									<span class="text-muted-foreground text-sm">Discord ID</span>
									<span class="text-sm font-medium">{account?.discordId}</span>
								</div>
								<Separator />
								<div class="flex items-center justify-between py-2">
									<span class="text-muted-foreground text-sm">Discord Username</span>
									<span class="text-sm font-medium">{account?.discordUsername}</span>
								</div>
							{:else}
								<Button
									variant="outline"
									size="sm"
									class="mt-3 w-full"
									onclick={() => {
										toast('Not Implemented Yet', {
											id: 'discord-link',
											description:
												'Linking your Discord account is not yet implemented. We will announce once this feature is available.',
											duration: 5_000, // 5 seconds
											dismissable: true
										});
									}}
								>
									<Icon icon="fa6-brands:discord" />
									Link Discord Account
								</Button>
							{/if}
						</Card.Content>
					</Card.Root>
				</div>

				<div class="col-span-2">
					<Card.Root>
						<Card.Header>
							<Card.Title>
								<div class="flex items-center justify-between">
									<span>Reputation Log</span>
									<Button size="sm" variant="link">View All</Button>
								</div>
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<ScrollArea class="h-64">
								<Table.Root class="w-full">
									<Table.Header>
										<Table.Row>
											<Table.Head class="w-64">Date</Table.Head>
											<Table.Head class="w-48">Points</Table.Head>
											<Table.Head>Reason</Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body class="text-sm">
										<Table.Row>
											<Table.Cell>{SwcTimestamp.fromDate(new Date())}</Table.Cell>
											<Table.Cell class="flex items-center gap-0.5">
												<Icon icon="lucide:arrow-big-up-dash" class="text-green-500" />
												<span>10</span>
											</Table.Cell>
											<Table.Cell>Positive Review Recieved</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell>{SwcTimestamp.fromDate(new Date())}</Table.Cell>
											<Table.Cell class="flex items-center gap-0.5">
												<Icon icon="lucide:arrow-big-down-dash" class="text-red-500" />
												<span>10</span>
											</Table.Cell>
											<Table.Cell>Negative Review Recieved</Table.Cell>
										</Table.Row>
									</Table.Body>
								</Table.Root>
							</ScrollArea>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</Tabs.Content>

		<Tabs.Content value="settings">
			<Card.Root>
				<Card.Header>
					<Card.Title>Account Settings</Card.Title>
				</Card.Header>
				<Card.Content class="grid grid-cols-1 gap-3">
					<div class="grid grid-cols-1 gap-2">
						<div class="flex flex-col">
							<Label>Listings View</Label>
							<p class="text-muted-foreground text-xs">
								This determines how the listings are displayed.
							</p>
						</div>
						<Select.Root
							type="single"
							name="listingViewStyle"
							bind:value={settingsState.listingViewStyle}
							onValueChange={autosave}
						>
							<Select.Trigger class="w-full">
								{#if settingsState.listingViewStyle === 'card'}
									<span>Card View</span>
								{:else if settingsState.listingViewStyle === 'table'}
									<span>Table View</span>
								{:else}
									<span>Select View Style</span>
								{/if}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="card">Card View</Select.Item>
								<Select.Item value="table">Table View</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</PageWrapper>
