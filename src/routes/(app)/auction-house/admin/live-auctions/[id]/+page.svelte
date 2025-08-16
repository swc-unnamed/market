<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { Switch } from '$lib/components/ui/switch';
	import { RadioTower, Cloud, Save, LockKeyhole } from '@lucide/svelte';
	import ListingDialog from '$lib/components/auction-house/ah-listing-dialog.svelte';
	import AuctionHouseAdminMenu from '$lib/components/common/auction-house/auction-house-admin-menu.svelte';
	import { broadcastLiveAuction } from '$lib/remote-fns/auction-house/live-auctions/broadcast-auction.remote.js';
	import {
		LabeledInput,
		LabeledTextarea,
		LabeledSelect
	} from '$lib/components/common/inputs/index.js';
	import { toDateTimeLocalString } from '$lib/utils/formatters.js';
	import StatusBadge from '$lib/components/layout/modules/auction-house/live-auctions/status-badge.svelte';
	import Icon from '@iconify/svelte';
	import { ezForm } from 'svelte-ez-form';
	import { updateAuction } from '$lib/remote-fns/auction-house/live-auctions/update-auction.remote.js';
	import { completeAuction } from '$lib/remote-fns/auction-house/live-auctions/complete-auction.remote.js';

	const { data } = $props();
	let auction = $derived(data.auction);

	let canEdit = $derived.by(() => {
		return auction?.status === 'Upcoming' || auction?.status === 'InProgress';
	});

	const updateForm = ezForm(updateAuction, {
		onSuccess: (result) => {
			if (result.success) {
				toast.success('Auction updated successfully!');
			}
		},
		onError: (error) => {
			toast.error('Failed to update auction!');
		},
		append: {
			id: data.auction?.id
		}
	});

	async function handleBroadcast() {
		const result = await broadcastLiveAuction(data.auction?.id);
		toast.success(result.message || 'Broadcast sent successfully!');
	}

	async function handleCompleteAuction() {
		const result = await completeAuction({ id: data.auction?.id });
		if (result.success) {
			toast.success('Auction Completed', {
				description:
					'This auction has been marked as completed. Make sure to finalize any necessary actions.'
			});
		} else {
			toast.error(result.message || 'Failed to complete auction.');
		}
	}
</script>

<PageWrapper
	title={data.auction?.title}
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

	<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
		<Card.Root class="md:col-span-1">
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title class="w-full">
						<div class="flex items-center justify-between">
							<h3 class="text-wrap">{auction?.title}</h3>
							<Button size="sm" variant="outline" form="updateForm" type="submit">
								<Icon icon="mdi:content-save" class="mr-2" />
								Save
							</Button>
						</div>
						<StatusBadge status={auction?.status} />
					</Card.Title>
				</div>
			</Card.Header>

			<Card.Content>
				<form id="updateForm" {...updateForm} class="grid grid-cols-1 gap-3">
					<LabeledSelect
						id="status"
						label="Status"
						selectLabel="label"
						key="value"
						options={[
							{ value: 'Upcoming', label: 'Upcoming' },
							{ value: 'InProgress', label: 'In Progress' },
							{ value: 'Cancelled', label: 'Cancelled' },
							{ value: 'Closed', label: 'Closed' }
						]}
						value={auction?.status}
					/>

					<LabeledInput id="title" label="Title" value={auction?.title} />

					<LabeledTextarea
						id="description"
						label="Description"
						value={auction?.description}
						rows={4}
					/>

					<LabeledInput
						id="startTime"
						label="Start Time"
						type="datetime-local"
						value={toDateTimeLocalString(auction?.startTime)}
					/>

					<LabeledSelect
						id="moderatorId"
						label="Moderator"
						options={data.availableModerators}
						key="id"
						selectLabel="username"
						value={auction?.moderatorId}
					/>
				</form>
			</Card.Content>
			<Card.Footer class="flex flex-wrap items-center gap-3">
				{#if auction?.status === 'Upcoming' || auction?.status === 'InProgress'}
					<Button size="sm" variant="outline" onclick={handleBroadcast}>
						<RadioTower class="mr-2" />
						Broadcast
					</Button>
				{/if}
				{#if auction?.status === 'Closed'}
					<Button size="sm" variant="outline" onclick={handleCompleteAuction}>
						<LockKeyhole class="mr-2" />
						Mark as Completed
					</Button>
				{/if}
			</Card.Footer>
		</Card.Root>

		<Card.Root class="md:col-span-2">
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title>Assigned Listings</Card.Title>
					{#if auction?.status === 'InProgress' || auction?.status === 'Upcoming'}
						<Button size="sm" variant="outline">Add Listing</Button>
					{/if}
				</div>
			</Card.Header>
			<Card.Content>
				{#each auction?.listings as listing}
					<Card.Root class="mb-4">
						<Card.Header>
							<div class="flex items-center justify-between">
								<Card.Title>{listing?.title}</Card.Title>
								<span class="text-muted-foreground text-sm">#{listing?.listingNumber}</span>
							</div>
						</Card.Header>
						<Card.Content>
							<div class="grid grid-cols-2 gap-2">
								<div>
									<strong>Status:</strong>
									{listing?.status}
								</div>
								<div>
									<strong>Minimum Bid:</strong>
									{listing?.minimumBid.toLocaleString()}
								</div>
								<div>
									<strong>Anonymous:</strong>
									{listing?.anonymous ? 'Yes' : 'No'}
								</div>
								<div>
									<strong># of Items:</strong>
									{1}
								</div>
							</div>
						</Card.Content>
						<Card.Footer class="flex gap-2">
							<ListingDialog auctionId={auction?.id} listingId={listing.id} />
							{#if auction?.status === 'Upcoming' || auction?.status === 'InProgress'}
								<Button size="sm" variant="outline">Remove Listing</Button>
							{/if}
						</Card.Footer>
					</Card.Root>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
