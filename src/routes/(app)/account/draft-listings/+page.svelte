<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { format } from 'date-fns';
	import { toast } from 'svelte-sonner';
	let { data } = $props();

	let selectAll = $state(false);
	let checkedItems = $state<string[]>([]);
	let alertDialogOpen = $state<string[]>([]);
	let deleteSelectedDialogOpen = $state(false);

	$effect(() => {
		if (selectAll) {
			checkedItems = data.records.map((record) => record.id);
		} else {
			checkedItems = [];
		}
	});

	const handleItemDelete = async ({ listingId }: { listingId: string }) => {
		const res = await fetch(`/api/auctions/listings/${listingId}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			toast('Listing deleted');
			await invalidate('draft_listings');
		} else {
			toast.error('Failed to delete listing');
		}
	};
</script>

<PageWrapper title="Draft Auction Listings">
	<div class="flex flex-col gap-3">
		<Alert.Root class="border-primary">
			<Alert.Description>
				<p>
					Here you can view and manage your draft Auction Listings. A draft Auction Listing is a
					listing that you created, as a placeholder or as a work in progress, but have not yet
					published.
				</p>
				<p>
					Click on the <span class="text-primary">Modify</span> button to edit the listing or
					<span class="text-red-500">Delete</span>
					to remove it.
				</p>
			</Alert.Description>
		</Alert.Root>

		<div class="flex items-center gap-3">
			<Button
				size="sm"
				variant="action"
				onclick={() => {
					selectAll = !selectAll;
				}}
			>
				<AurebeshText text="D" />
				{selectAll ? 'Deselect All' : 'Select All'}
			</Button>

			<AlertDialog.Root bind:open={deleteSelectedDialogOpen}>
				<AlertDialog.Trigger class="w-full md:w-auto">
					<Button
						size="sm"
						variant="action"
						class="text-red-500"
						disabled={checkedItems.length === 0}
					>
						<AurebeshText text="D" />
						Delete Selected
					</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
						<AlertDialog.Description>
							You are about to <span class="text-red-500"> delete all selected </span> draft listing
							Are you sure you want to do this?
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<AlertDialog.Action
							onclick={() => {
								checkedItems.forEach((listingId) => {
									handleItemDelete({ listingId });
								});

								if (selectAll) {
									selectAll = false;
								}

								deleteSelectedDialogOpen = false;
							}}>Yes, delete all selected Drafts</AlertDialog.Action
						>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>

		<Table.Root>
			<Table.Caption>You have {data.records.length} draft Auction Listings</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Cell>
						<Checkbox bind:checked={selectAll} aria-labelledby="terms-label" />
					</Table.Cell>
					<Table.Cell>ALID</Table.Cell>
					<Table.Cell>Title</Table.Cell>
					<Table.Cell>Created</Table.Cell>
					<Table.Cell># of Items</Table.Cell>
					<Table.Cell></Table.Cell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.records as listing (listing.id)}
					<Table.Row class="hover:cursor-pointer">
						<Table.Cell class="w-12">
							<Checkbox
								aria-labelledby="terms-label"
								checked={checkedItems.includes(listing.id)}
								onCheckedChange={(v) => {
									if (v) {
										checkedItems = [...checkedItems, listing.id];
									} else {
										checkedItems = checkedItems.filter((item) => item !== listing.id);
									}
								}}
							/>
						</Table.Cell>
						<Table.Cell class="w-24">{listing.listingNumber}</Table.Cell>
						<Table.Cell class="w-48 truncate">{listing.title}</Table.Cell>
						<Table.Cell class="w-48">{format(listing.createdAt, 'yyyy-MM-dd HH:mm')}</Table.Cell>
						<Table.Cell class="w-48">{listing.items.length}</Table.Cell>
						<Table.Cell class="w-56">
							<Button size="sm" variant="action" href={`/auctions/listings/${listing.id}/modify`}>
								<AurebeshText text="M" />
								Modify
							</Button>
							<AlertDialog.Root open={alertDialogOpen.includes(listing.id)}>
								<AlertDialog.Trigger class="w-full md:w-auto">
									<Button
										size="sm"
										variant="action"
										class="text-red-500"
										onclick={() => {
											alertDialogOpen = [...alertDialogOpen, listing.id];
										}}
									>
										<AurebeshText text="D" />
										Delete
									</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
										<AlertDialog.Description>
											You are about to <span class="text-red-500"> delete </span> draft listing
											<span class="text-primary">ALID {listing.listingNumber}</span>. Are you sure
											you want to do this?
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel
											onclick={() =>
												(alertDialogOpen = alertDialogOpen.filter((id) => id !== listing.id))}
										>
											Cancel
										</AlertDialog.Cancel>
										<AlertDialog.Action
											onclick={async () => {
												await handleItemDelete({ listingId: listing?.id });
												alertDialogOpen = alertDialogOpen.filter((id) => id !== listing.id);
											}}>Yes, delete it</AlertDialog.Action
										>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</PageWrapper>
