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
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug from 'sveltekit-superforms';
	import { liveAuctionSchema } from '$lib/models/schemas/live-auction.schema.js';
	import { toast } from 'svelte-sonner';
	import AuctionHouseAdminMenu from '$lib/components/common/auction-house/auction-house-admin-menu.svelte';

	const { data } = $props();

	const form = superForm(data.createAuctionForm, {
		dataType: 'json',
		validators: zodClient(liveAuctionSchema),
		onError: ({ result }) => {
			console.log(result);
			toast.error('There was an error creating the auction. Please check the form and try again.');
		}
	});

	const { form: formData, enhance } = form;

	const pendingListings = $derived(data.pendingListings);
	const selectedModeratorObject = $derived.by(() => {
		return data.availableModerators.find((mod) => mod.id === $formData.moderatorId);
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
			title: 'Admin',
			href: '/auction-house/admin'
		},
		{
			title: 'Live Auctions',
			href: '/auction-house/admin/live-auctions'
		}
	]}
>
	{#snippet right()}
		<AuctionHouseAdminMenu />
	{/snippet}

	<div class="grid grid-cols-1 gap-3">
		<Card.Root>
			<Card.Header>
				<Card.Title>Create a Live Auction</Card.Title>
			</Card.Header>
			<Card.Content>
				<form class="grid grid-cols-1 gap-4" action="?/create" method="post" use:enhance>
					<Form.Field {form} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Title</Form.Label>
								<Input {...props} bind:value={$formData.title} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="description">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Description</Form.Label>
								<Textarea {...props} bind:value={$formData.description} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="startTime">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Start Time</Form.Label>
								<Input type="datetime-local" {...props} bind:value={$formData.startTime} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="moderatorId">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Moderator</Form.Label>
								<Select.Root type="single" name="moderator" bind:value={$formData.moderatorId}>
									<Select.Trigger class="w-full">
										{#if $formData.moderatorId}
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
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<div class="flex justify-end">
						<Button type="submit">Create Auction</Button>
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
									<Checkbox
										checked={$formData.listings.includes(listing.id)}
										onCheckedChange={(v) => {
											if (v) {
												$formData.listings = [...$formData.listings, listing.id];
											} else {
												$formData.listings = $formData.listings.filter((id) => id !== listing.id);
											}
										}}
									/>
								</Table.Cell>
								<Table.Cell>{listing.listingNumber}</Table.Cell>
								<Table.Cell>{listing.title}</Table.Cell>
								<Table.Cell>{listing._count.items}</Table.Cell>
								<Table.Cell>{listing.minimumBid.toLocaleString()}</Table.Cell>
								<Table.Cell>{listing.anonymous ? 'Yes' : 'No'}</Table.Cell>
							</Table.Row>
						{/each}
						{#if pendingListings?.length === 0}
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
