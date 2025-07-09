<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { liveAuctionSchema } from '../components/schemas';
	import { toast } from 'svelte-sonner';
	import { Switch } from '$lib/components/ui/switch';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Dialog from '$lib/components/ui/dialog';
	import { RadioTower, Cloud, Save, LockKeyhole } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Label } from '$lib/components/ui/label';
	import { goto, invalidate } from '$app/navigation';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import ListingDialog from '../components/listing-dialog.svelte';

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

	async function removeListing(listingId: string) {
		const response = await fetch(`/api/auctions/live/${auction.id}/listings/${listingId}`, {
			method: 'DELETE',
			body: JSON.stringify({})
		});

		if (response.ok) {
			toast.success('Listing has been removed successfully.');
			await invalidate('app:auction-house/admin/live-auctions');
		} else {
			const error = await response.json();
			toast.error(`Failed to remove listing: ${error.message}`);
		}
	}
</script>

<PageWrapper
	title={data.auction.title}
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
							{#snippet children({ props })}
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

					{#if !auction.endedAt}
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
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title>Assigned Listings</Card.Title>
					<Button size="sm" variant="outline">Add Listing</Button>
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
									<ListingDialog auctionId={auction.id} listingId={listing.id} />
									<Button size="sm" variant="outline">Remove Listing</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
