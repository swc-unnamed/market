<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import Icon from '@iconify/svelte';
	import { format } from 'date-fns';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { cn } from '$lib/utils.js';

	let { data } = $props();
	let record = $derived(data.record);

	let editable = !record.completedAt;

	const { form, enhance } = superForm(data.form, {
		dataType: 'json',
		onResult: ({ result }) => {
			console.log(result);

			if (result.type === 'failure') {
				toast.error(result.data?.message);
			}

			if (result.type === 'success') {
				toast('Auction updated successfully!');
			}
		}
	});
</script>

<svelte:head>
	<title>Modify Auction: {record.title} | Unnamed Market</title>
</svelte:head>

<Card.Root>
	<Card.Header>
		<Card.Title>
			<div class="flex flex-col gap-3 md:justify-between">
				<div>
					<span class="text-primary">{record.title}</span>
				</div>

				<div class="flex justify-between gap-3">
					<AlertDialog.Root>
						{#if editable}
							<AlertDialog.Trigger
								class={cn(buttonVariants({ variant: 'action' }), 'text-red-500')}
							>
								<AurebeshText text="D" />
								<span>Delete</span>
							</AlertDialog.Trigger>
						{/if}
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
								<AlertDialog.Description>
									This action cannot be undone. This will permanently delete the auction from the
									holochain. All listings associated with this auction will be returned back to a <span
										class="text-primary">new</span
									> state.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<form method="post" action="?/delete" use:enhance>
									<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
									<AlertDialog.Action type="submit">Delete Auction</AlertDialog.Action>
								</form>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>

					{#if editable}
						<form method="post" action="?/save" use:enhance>
							<Button variant="link" size="sm" type="submit">
								<AurebeshText text="S" />
								<span>Save</span>
							</Button>
						</form>
					{/if}
				</div>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-3">
		<div class="flex flex-col gap-1">
			<Label>Auction Title</Label>
			<Input disabled={!editable} bind:value={$form.title} />
		</div>

		<div class="flex flex-col gap-1">
			<Label>Start Time</Label>
			<Input type="datetime-local" disabled={!editable} bind:value={$form.startAt} />
		</div>

		<Separator class="bg-primary" />

		<div class="flex flex-col gap-0">
			<h3>Current Listings</h3>
			<p class="text-sm">These are the current listings that will be available on this Auction.</p>
		</div>

		<div class="flex flex-col gap-2">
			{#each record.listings as listing, i}
				<div class="flex flex-row items-center gap-3 rounded-md border p-2">
					<Checkbox
						disabled={!editable}
						checked={$form.listings.some((item) => item === listing.id)}
						onCheckedChange={(v) => {
							if (v) {
								$form.listings = [...$form.listings, listing.id];
							} else {
								$form.listings = $form.listings.filter((item) => item !== listing.id);
							}
						}}
					/>
					<div class="flex flex-col">
						<span class="-mb-1">{listing.title}</span>
						<span style="font-family: 'Galactic Basic" class="text-xs"
							>${integerToCredit(listing.startingPrice ?? 0)}</span
						>
					</div>
				</div>
			{/each}
		</div>

		<div class="flex flex-col gap-0">
			<h3>Available Listings</h3>
			<p class="text-sm">You can add these listings to the Auction.</p>
		</div>

		<div class="flex flex-col gap-2">
			{#each data.listingRecords as listing, i}
				<div class="flex flex-row items-center gap-3 rounded-md border p-2">
					<Checkbox
						checked={$form.listings.some((item) => item === listing.id)}
						onCheckedChange={(v) => {
							if (v) {
								$form.listings = [...$form.listings, listing.id];
							} else {
								$form.listings = $form.listings.filter((item) => item !== listing.id);
							}
						}}
					/>
					<div class="flex flex-col">
						<span class="-mb-1">{listing.title}</span>
						<span style="font-family: 'Galactic Basic" class="text-xs"
							>${integerToCredit(listing.startingPrice ?? 0)}</span
						>
					</div>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
