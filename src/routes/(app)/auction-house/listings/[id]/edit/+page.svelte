<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import TableListingItems from '$lib/components/auction-house/ah-table-listing-items.svelte';
	import ItemForm from '$lib/components/auction-house/ah-item-form.svelte';
	import NumberInput from '$lib/components/number-input.svelte';
	import AuctionHouseMenu from '$lib/components/common/auction-house/auction-house-menu.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let listing = $derived(data.listing);
	let deleteConfirmDialogOpen = $state(false);
	let publicConfirmDialogOpen = $state(false);

	const { form, enhance } = superForm(data.listingForm, {
		dataType: 'json',
		resetForm: false,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Data saved to the holochain successfully');
			} else {
				toast.error('An error occurred while saving data to the holochain');
				console.error(result);
			}
		}
	});

	async function deleteListing() {
		const response = await fetch(`/api/auction-house/listings/${listing.id}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			return toast.error(response.statusText);
		}

		toast.success('Listing deleted');

		await goto(`/auction-house/dashboard`);
	}
</script>

<PageWrapper
	title={`Edit`}
	breadcrumb={[
		{ title: 'Auction House', href: '/auction-house' },
		{ title: 'Listings', href: '/auction-house/listings' },
		{
			title: `#${listing.listingNumber} - ${listing.title}`,
			href: `/auction-house/listings/${listing.id}`
		}
	]}
>
	{#snippet right()}
		<AuctionHouseMenu />
	{/snippet}

	<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
		<form method="post" use:enhance>
			<Card.Root>
				<Card.Header>
					<Card.Title>General Information</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="grid grid-cols-1 gap-2">
						<div class="grid gap-1">
							<Label>Title</Label>
							<Input bind:value={$form.title} />
						</div>

						<div class="grid gap-1">
							<Label>Details</Label>
							<Textarea placeholder={'Enter your details here'} bind:value={$form.description} />
						</div>

						<div class="grid gap-1">
							<Label>Location</Label>
							<Textarea
								placeholder={`Sector: 
System:
							`}
								bind:value={$form.location}
							/>
						</div>

						<div class="grid gap-1">
							<Label>Credit Recipient</Label>
							<Input bind:value={$form.creditsRecipient} />
						</div>

						<div class="grid gap-1">
							<Label>Minimum Bid</Label>
							<NumberInput bind:value={$form.minimumBid} />
						</div>
					</div>
				</Card.Content>
				<Card.Footer class="flex justify-between">
					<div class="justify-start">
						<Button
							variant="destructive"
							onclick={() => {
								deleteConfirmDialogOpen = true;
							}}
						>
							Delete
						</Button>
					</div>
					<div class="items-center justify-end gap-3">
						<Button variant="outline" onclick={() => (publicConfirmDialogOpen = true)}>
							Publish
						</Button>
						<Button variant="outline" type="submit" formaction="?/save_listing">Save</Button>
					</div>
				</Card.Footer>
			</Card.Root>
		</form>

		<div class="col-span-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Listing Items</Card.Title>
				</Card.Header>
				<Card.Content>
					<Tabs.Root value="current">
						<Tabs.List class="w-full">
							<Tabs.Trigger value="current">Current Items</Tabs.Trigger>
							<Tabs.Trigger value="add">Add Item</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="current">
							<TableListingItems
								data={data.listingEntities.map((it) => {
									return {
										id: it.id,
										name: it.name,
										quantity: it.auctionItems[0].quantity,
										image: it.auctionItems[0].customImage || it.imageSmall,
										uuu: it.auctionItems[0].uuu
									};
								})}
							/>
						</Tabs.Content>
						<Tabs.Content value="add">
							<ItemForm {data} />
						</Tabs.Content>
					</Tabs.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</div>

	<AlertDialog.Root bind:open={publicConfirmDialogOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{listing.title}</AlertDialog.Title>
				<AlertDialog.Description>
					Are you sure you want to publish this listing? After you publish, it will be published to
					the holochain and
					<span class="text-orange-600">cannot be edited</span> anymore.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<form action="?/publish_listing" method="post">
					<Button type="submit">Publish</Button>
				</form>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<AlertDialog.Root bind:open={deleteConfirmDialogOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will
					<span class="text-destructive"> permanently delete </span> this listing from the holochain.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<Button variant="destructive" onclick={deleteListing}>Delete</Button>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</PageWrapper>
