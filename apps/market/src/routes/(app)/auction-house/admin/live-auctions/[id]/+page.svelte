<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import * as Alert from '$lib/components/ui/alert';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { Switch } from '$lib/components/ui/switch';
	import { RadioTower, Cloud, Save, LockKeyhole } from '@lucide/svelte';
	import { enhance as formEnhance } from '$app/forms';
	import ListingDialog from '../components/listing-dialog.svelte';
	import AuctionHouseAdminMenu from '$lib/components/common/auction-house/auction-house-admin-menu.svelte';
	import { invalidate } from '$app/navigation';

	const { data } = $props();

	const form = superForm(data.updateAuctionForm, {
		dataType: 'json',
		onError: ({ result }) => {
			console.log(result);
			toast.error('There was an error creating the auction. Please check the form and try again.');
		},
		onResult: ({ result }) => {
			console.log(result);
		}
	});
	const { form: formData, enhance } = form;

	let edit = $state(false);
	let displayListingDetails = $state(false);

	const auction = $derived(data.auction);
	const selectedListing = $derived(data.selectedListing);

	const selectedModeratorObject = $derived.by(() => {
		return data.availableModerators.find((mod) => mod.id === $formData.moderatorId);
	});

	const availableModerators = $derived.by(() => {
		return data.availableModerators.map((mod) => ({
			value: mod.id,
			label: mod.profile?.displayName || mod.username
		}));
	});

	$effect(() => {
		if (selectedListing) {
			displayListingDetails = true;
		} else {
			displayListingDetails = false;
		}
	});
</script>

<PageWrapper
	title={data.auction.title}
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
				<div class="flex items-center justify-between">
					<Card.Title>{auction.title}</Card.Title>
					{#if !auction.endedAt}
						<div class="flex items-center gap-3">
							<span>Edit</span>
							<Switch bind:checked={edit} />
						</div>
					{/if}
				</div>
			</Card.Header>

			<Card.Content>
				<form class="grid grid-cols-1 gap-4" method="post" use:enhance>
					<Form.Field {form} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Title</Form.Label>
								<Input {...props} bind:value={$formData.title} readonly={!edit} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="description">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Description</Form.Label>
								<Textarea {...props} bind:value={$formData.description} readonly={!edit} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="startTime">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Start Time</Form.Label>
								<Input
									type="datetime-local"
									{...props}
									bind:value={$formData.startTime}
									readonly={!edit}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="moderatorId">
						<Form.Control>
							{#snippet children()}
								<Form.Label>Moderator</Form.Label>
								<Select.Root type="single" name="moderator" bind:value={$formData.moderatorId}>
									<Select.Trigger class="w-full" disabled={!edit}>
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

					{#if auction.status === 'Upcoming' || auction.status === 'InProgress'}
						<div class="flex justify-end gap-3">
							<Button size="sm" variant="destructive" formaction="?/end" type="submit">
								<LockKeyhole />
								End Auction
							</Button>
							<Button size="sm" variant="outline" formaction="?/save" type="submit">
								<Save />
								Save Changes
							</Button>
							<Button
								size="sm"
								variant="outline"
								onclick={() => {
									toast.warning(
										'This feature is not yet implemented. It will be available in a future update.'
									);
								}}
							>
								<RadioTower />
								Broadcast Auction
							</Button>
						</div>
					{/if}
				</form>
			</Card.Content>
			<Card.Footer class="flex justify-end">
				<form
					method="post"
					use:formEnhance={({}) => {
						return async ({ result }) => {
							if (result.type === 'failure') {
								toast.error((result.data?.message as string) || 'Failed to close auction!');
							}

							if (result.type === 'success') {
								toast.success('Auction closed successfully!');
								await invalidate('app:auction-house/admin/live-auctions');
							}
						};
					}}
				>
					{#if auction.status === 'Completed'}
						<Button variant="outline" formaction="?/close" type="submit">Close Auction</Button>
					{/if}

					{#if auction.status === 'Closed'}
						<Alert.Root>
							<Alert.Title>Auction Closed</Alert.Title>
							<Alert.Description>
								This auction has been closed. You can no longer make changes to it.
							</Alert.Description>
						</Alert.Root>
					{/if}
				</form>
			</Card.Footer>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title>Assigned Listings</Card.Title>
					{#if auction.status === 'InProgress' || auction.status === 'Upcoming'}
						<Button size="sm" variant="outline">Add Listing</Button>
					{/if}
				</div>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>AHLID</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head>Title</Table.Head>
							<Table.Head># of Items</Table.Head>
							<Table.Head>Minimum Bid</Table.Head>
							<Table.Head>Anonymous</Table.Head>
							<Table.Head>Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each auction?.listings as listing}
							<Table.Row>
								<Table.Cell>{listing.listingNumber}</Table.Cell>
								<Table.Cell>{listing.status}</Table.Cell>
								<Table.Cell>{listing.title}</Table.Cell>
								<Table.Cell>{1}</Table.Cell>
								<Table.Cell>{listing.minimumBid.toLocaleString()}</Table.Cell>
								<Table.Cell>{listing.anonymous ? 'Yes' : 'No'}</Table.Cell>
								<Table.Cell class="flex w-48 gap-2">
									{#if auction.status === 'InProgress' || auction.status === 'Upcoming' || auction.status === 'Completed'}
										<ListingDialog auctionId={auction.id} listingId={listing.id} />

										{#if auction.status === 'Upcoming' || auction.status === 'InProgress'}
											<Button size="sm" variant="outline">Remove Listing</Button>
										{/if}
									{/if}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
