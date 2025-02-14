<script lang="ts">
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { integerToCredit } from '$lib/helpers/currency-conversion.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	let listings = $derived(data.listingRecords);

	const { form, enhance } = superForm(data.form, {
		dataType: 'json',
		onResult: ({ result }) => {
			console.log(result);

			if (result.type === 'failure') {
				toast.error(result.data?.message);
			}

			if (result.type === 'success') {
				toast.success('Auction created successfully!');
			}
		}
	});

	$inspect(data.listingRecords);
</script>

<PageWrapper title="New Auction">
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<div class="flex justify-between">
					<span>Create a new Auction</span>
					<form method="post" action="?/create" use:enhance>
						<Button variant="action" size="sm" type="submit">
							<AurebeshText text="C" />
							<span>Create Auction</span>
						</Button>
					</form>
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content class="grid grid-cols-1 gap-3">
			<div class="flex flex-col gap-1">
				<span>Give it a title and select the listings you want to include in the auction.</span>
				<Alert.Root class="border-danger">
					<Alert.Title>Important</Alert.Title>
					<Alert.Description>
						This type of Auction is for Unnamed proctored Auctions. Meaning, auctions that are ran
						within Discord or other platforms.
					</Alert.Description>
				</Alert.Root>
			</div>
			<div class="flex flex-col gap-2">
				<div class="flex flex-col gap-1">
					<Label>Auction Title</Label>
					<Input bind:value={$form.title} />
				</div>

				<div class="flex flex-col gap-1">
					<Label>Start Time</Label>
					<Input type="datetime-local" bind:value={$form.startAt} />
				</div>

				<Separator class="bg-primary" />

				<div class="flex flex-col gap-0">
					<h3>Listing Selection</h3>
					<p class="text-sm">Select which listings you want to add to this auction.</p>
				</div>
				<div class="flex flex-col gap-2">
					{#each listings as listing}
						<div class="flex flex-row items-center gap-3 rounded-md border p-2">
							<Checkbox
								onCheckedChange={(v) => {
									if (v) {
										$form.listings = [...$form.listings, listing.id];
									} else {
										$form.listings = $form.listings.filter((id) => id !== listing.id);
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
			</div>
		</Card.Content>
	</Card.Root>
</PageWrapper>
