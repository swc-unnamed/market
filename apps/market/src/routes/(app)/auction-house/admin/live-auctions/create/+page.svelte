<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	const { data } = $props();

	const pendingListings = $derived(data.pendingListings);
	let selectedModerator = $state('');
	const selectedModeratorObject = $derived.by(() => {
		return data.availableModerators.find((mod) => mod.id === selectedModerator);
	});
	const availableModerators = $derived.by(() => {
		return data.availableModerators.map((mod) => ({
			value: mod.id,
			label: mod.profile?.displayName || mod.username
		}));
	});
</script>

<PageWrapper
	title="Create Live Auction"
	breadcrumb={[
		{ title: 'Auction House', href: '/auction-house' },
		{
			title: 'Admin Terminal',
			href: '/auction-house/admin'
		},
		{
			title: 'Live Auctions',
			href: '/auction-house/admin/live-auctions'
		}
	]}
>
	{#snippet right()}
		<Button size="sm" variant="destructive" href="/auction-house/dashboard">
			Exit Admin Terminal
		</Button>
	{/snippet}

	<div class="grid grid-cols-1 gap-3">
		<Card.Root>
			<Card.Header>
				<Card.Title>Create a Live Auction</Card.Title>
			</Card.Header>
			<Card.Content>
				<form class="grid grid-cols-1 gap-4">
					<div class="grid grid-cols-1 gap-2">
						<Label>Title</Label>
						<Input />
					</div>
					<div class="grid grid-cols-1 gap-2">
						<Label>Description</Label>
						<Textarea />
					</div>
					<div class="grid grid-cols-1 gap-2">
						<Label>Start Time</Label>
						<Input type="datetime-local" />
						<p class="text-muted-foreground text-sm">
							This is your local time, not the server time. We will convert it and display it
							properly for each user.
						</p>
					</div>

					<div class="grid grid-cols-1 gap-2">
						<Label>Moderator</Label>
						<Select.Root type="single" name="moderator" bind:value={selectedModerator}>
							<Select.Trigger class="w-full">
								{#if selectedModerator}
									{selectedModeratorObject?.profile?.displayName}
								{:else}
									Select a moderator
								{/if}
							</Select.Trigger>
							<Select.Content>
								{#each availableModerators as mod}
									<Select.Item value={mod.value}>
										{mod.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="flex justify-end">
						<Button>Create Auction</Button>
					</div>
				</form>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Available Listings</Card.Title>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head></Table.Head>
							<Table.Head>AHLID</Table.Head>
							<Table.Head>Title</Table.Head>
							<Table.Head># of Items</Table.Head>
							<Table.Head>Minimum Bid</Table.Head>
							<Table.Head>Anonymous</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each pendingListings as listing}
							<Table.Row>
								<Table.Cell>
									<Checkbox />
								</Table.Cell>
								<Table.Cell>{listing.listingNumber}</Table.Cell>
								<Table.Cell>{listing.title}</Table.Cell>
								<Table.Cell>{listing._count.items}</Table.Cell>
								<Table.Cell>{listing.minimumBid.toLocaleString()}</Table.Cell>
								<Table.Cell>{listing.anonymous ? 'Yes' : 'No'}</Table.Cell>
							</Table.Row>
						{/each}
						{#if pendingListings.length === 0}
							<Table.Row>
								<Table.Cell colspan={5} class="text-muted-foreground text-center">
									No pending listings available.
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
