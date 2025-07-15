<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { RadioTower } from '@lucide/svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import { Badge } from '$lib/components/ui/badge';
	import NumberInput from '$lib/components/number-input.svelte';
	import { invalidate } from '$app/navigation';

	interface Props {
		listingId: string;
		auctionId: string;
	}

	let { listingId, auctionId }: Props = $props();
	let dialogOpen = $state(false);

	let selectedWinnerId = $state<string | undefined>(undefined);
	let saleAmount = $state<string | undefined>(undefined);
	let selectedStatus = $state<string>('');

	async function loadListing() {
		const response = await fetch(`/api/auctions/live/${auctionId}/listings/${listingId}`, {
			method: 'GET'
		});

		if (response.ok) {
			const data = await response.json();
			if (data.winnerId) {
				selectedWinnerId = data.winnerId;
			}

			if (data.winningBidAmount) {
				saleAmount = data.winningBidAmount.toLocaleString();
			}

			selectedStatus = data.status;

			return data;
		} else {
			toast.error('Failed to load listing details.');
			throw new Error('Failed to load listing details');
		}
	}

	async function recordSale() {
		if (!selectedWinnerId || !saleAmount) {
			toast.error('Please select a winner and enter a sale amount.');
			return;
		}

		const response = await fetch(
			`/api/auctions/live/${auctionId}/listings/${listingId}/record-sale`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					winnerId: selectedWinnerId,
					saleAmount: saleAmount,
					status: selectedStatus
				})
			}
		);

		if (response.ok) {
			toast.success('Sale recorded successfully.');
			dialogOpen = false;
			await invalidate(`app:auction-house/admin/live-auctions`);
		} else {
			toast.error('Failed to record sale.');
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class={buttonVariants({
			size: 'sm',
			variant: 'outline'
		})}>Auction Interface</Dialog.Trigger
	>
	<Dialog.Content
		class="min-w-2/3"
		interactOutsideBehavior={'ignore'}
		escapeKeydownBehavior={'ignore'}
	>
		<Dialog.Header>
			<Dialog.Title>Listing Management</Dialog.Title>
			<Dialog.Description>
				<Button
					size="sm"
					variant="outline"
					onclick={() => {
						toast('Broadcasting...');
					}}
				>
					<RadioTower />
					Broadcast Listing
				</Button>
			</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="h-[500px] w-full">
			{#await loadListing()}
				<p>Loading details...</p>
			{:then data}
				<Tabs.Root value="1" class="px-3">
					<Tabs.List>
						<Tabs.Trigger value="1">Details</Tabs.Trigger>
						<Tabs.Trigger value="2">Items</Tabs.Trigger>
						<Tabs.Trigger value="3">Ledger</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="1">
						<div class="grid grid-cols-1 gap-3">
							<div class="grid grid-cols-1 gap-1">
								<Label>Title</Label>
								<Input value={data.title} readonly />
							</div>
							<div class="grid grid-cols-1 gap-1">
								<Label>Description</Label>
								<Textarea value={data.description} readonly />
							</div>
							<div class="grid grid-cols-1 gap-1">
								<Label>Location</Label>
								<Textarea value={data.description} readonly />
							</div>
							<div class="grid grid-cols-1 gap-1">
								<Label>Minimum Bid</Label>
								<Input value={data.minimumBid.toLocaleString()} readonly />
							</div>
							<div class="grid grid-cols-1 gap-1">
								<Label>Credits Recipient</Label>
								<Input value={data.creditsRecipient} readonly />
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="2">
						{#each data.items as item}
							<Card.Root>
								<Card.Content>
									<div class="flex items-start gap-2">
										<img
											src={item.customImage ? item.customImage : item.entity.imageSmall}
											alt={item.entity.name}
										/>
										<div class="flex flex-col items-start gap-1">
											<span>{item.customName ? item.customName : item.entity.name}</span>
											<div class="flex items-center gap-1">
												<Badge>{item.uuu ? 'UUU' : 'Not UUU'}</Badge>
												<Badge>{item.imported ? 'Verified' : 'Not Verified'}</Badge>
												<Badge>{item.unique ? 'Unique' : 'Not Unique'}</Badge>
											</div>
											<div>
												<span>Quantity: {item.quantity}</span>
											</div>
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						{/each}
					</Tabs.Content>

					<Tabs.Content value="3">
						<div class="grid grid-cols-1 gap-3">
							<div class="grid grid-cols-1 gap-1">
								<Label>Sale Amount</Label>
								<NumberInput bind:value={saleAmount} placeholder="Enter sale amount" />
							</div>
							<div class="grid grid-cols-1 gap-1">
								<Label>Buyer</Label>
								<Select.Root type="single" name="winnerId" bind:value={selectedWinnerId}>
									<Select.Trigger class="w-full">
										{#if selectedWinnerId}
											{data.users.find((u: any) => u.id === selectedWinnerId)?.profile
												?.displayName || 'Select a winner'}
										{:else}
											Select a winner
										{/if}
									</Select.Trigger>
									<Select.Content class="w-full">
										{#each data.users as user}
											<Select.Item value={user.id}>
												<div class="flex items-center gap-1">
													<img
														class="size-8 rounded-full"
														src={user.profile.avatar}
														alt={user.profile.displayName}
													/>
													<span>{user.profile.displayName}</span>
												</div>
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</div>

							<div class="grid grid-cols-1 gap-1">
								<Label>Status</Label>
								<Select.Root type="single" name="status" bind:value={selectedStatus}>
									<Select.Trigger class="w-full">
										{selectedStatus}
									</Select.Trigger>
									<Select.Content class="w-full">
										<Select.Item value={'Active'}>Active</Select.Item>
										<Select.Item value={'Sold'}>Sold</Select.Item>
										<Select.Item value={'PendingMakeover'}>Pending Makeover</Select.Item>
										<Select.Item value={'Complete'}>Complete</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>
						</div>
					</Tabs.Content>
				</Tabs.Root>
			{/await}
		</ScrollArea>
		<Dialog.Footer class="flex w-full flex-row items-center justify-between">
			<Dialog.Close class={buttonVariants({ size: 'sm', variant: 'ghost' })}>Close</Dialog.Close>
			<Button size="sm" variant="outline" onclick={recordSale}>Save Changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
