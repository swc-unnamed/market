<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { getContext } from 'svelte';
	import type { User } from '$lib/models/shared';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import CreditInput from '$lib/components/custom/inputs/credit-input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { blur } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import AssetLookup from '$lib/components/custom/shared/asset-lookup.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Icon from '$lib/components/custom/shared/icon.svelte';
	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { newAuctionListingSchema } from '$lib/helpers/zod/auction-listing.schema.js';

	const user = getContext<User>('user');
	let { data } = $props();

	const { form, errors, enhance, validateForm, submit } = superForm(data.form, {
		dataType: 'json',
		id: 'newListing',
		validators: zodClient(newAuctionListingSchema),
		onResult: (res) => {
			console.log(res);
			if (res.result.type == 'success') {
				toast.success(res.result?.data?.form.message);
			}

			if (res.result.type === 'failure') {
				errors.set(res.result?.data?.form.errors);
				toast.error('There as an error trying to submit your request to the holochain.');
			}
		}
	});

	async function handleSubmit() {
		submit();
	}
</script>

<LayoutWrapper
	title="New Auction Listing"
	subTitle="Create a new listing to be picked up in an upcoming auction."
>
	<form method="POST" action="?/createListing" use:enhance></form>
	<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
		<div>
			<div class="grid grid-cols-1 gap-2">
				<Alert.Root class="border-0">
					<Alert.Title class="flex items-center">
						<Icon icon="mdi:info-outline" class="mr-2 h-6 w-6 text-blue-600" />
						Greetings, {user.name}
					</Alert.Title>
					<Alert.Description>
						Input the following parameters and our droids will take care of the rest. Take your time
						though, once you have submitted the listing to our holonet, you will not be able to
						change it.
					</Alert.Description>
				</Alert.Root>

				<div class="mb-3 flex justify-center">
					<Separator class="w-2/3 rounded-md bg-primary" />
				</div>

				<Card.Root>
					<Card.Content>
						<div class="flex flex-col gap-4">
							<div class="grid gap-1">
								<Label>Title</Label>
								<Input bind:value={$form.title} />

								{#if $errors.title}
									<p class="text-xs text-red-600">{$errors.title}</p>
								{/if}
							</div>
							<div class="grid gap-1">
								<Label>Details</Label>
								<Textarea bind:value={$form.description} />

								{#if $errors.description}
									<p class="text-xs text-red-600">{$errors.description}</p>
								{/if}
							</div>
							<div class="grid gap-1">
								<Label>Location</Label>
								<Textarea bind:value={$form.location} />
								{#if $errors.location}
									<p class="text-xs text-red-600">{$errors.location}</p>
								{/if}
							</div>
							<div class="grid gap-1">
								<Label>Who should we send the credits to?</Label>
								<Input bind:value={$form.sendCreditsTo} />
								{#if $errors.sendCreditsTo}
									<p class="text-xs text-red-600">{$errors.sendCreditsTo}</p>
								{/if}
							</div>
							<div class="grid gap-1">
								<div class="flex items-center gap-1">
									<Label>Remain Anonymous</Label>
									<Switch bind:checked={$form.listerIsAnon} />
								</div>
								<span class="text-xs text-muted-foreground">
									We won't associate your name to this listing and will use a Unnamed Imperium
									Market approved middle.
								</span>
							</div>
							<div class="grid gap-1">
								<CreditInput label="Starting Price" bind:value={$form.startingPrice} />
								{#if $errors.startingPrice}
									<p class="text-xs text-red-600">{$errors.startingPrice}</p>
								{/if}
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<div class="flex justify-end gap-2">
					<Button class="flex items-center" variant="default" onclick={handleSubmit}>
						<Icon icon="mdi:invoice-check-outline" class="size-8" />
						Save Listing
					</Button>

					<Button
						class="flex items-center"
						variant="ghost"
						onclick={() => {
							$form.items = [
								...$form.items,
								{ quantity: 1, u3: true, customImageUrl: null, assetId: null }
							];
						}}
					>
						<Icon icon="mdi:invoice-text-new-outline" class="size-4" />
						Add New Item
					</Button>
				</div>
			</div>
		</div>

		<ScrollArea>
			<div class="grid grid-cols-1 gap-2">
				{#each $form.items as item, i}
					<div transition:blur={{ duration: 150, easing: cubicOut }}>
						<Card.Root class="border-0">
							<Card.Header>
								<Card.Title>
									<div class="flex items-center justify-between">
										{#if $form.items[i].assetId}
											<span>{data.assets.find((x) => x.id == $form.items[i].assetId)?.name}</span>
										{:else}
											<span>New Item {i + 1}</span>
										{/if}
										<div class="flex items-center gap-2">
											<Button
												variant="ghost"
												size="sm"
												onclick={() => {
													$form.items = $form.items.filter((_, j) => j !== i);
												}}
											>
												<Icon icon="mdi:death-star-variant" class="size-4 text-red-600" />
												Remove
											</Button>
											<AssetLookup bind:value={$form.items[i].assetId} assets={data.assets} />
										</div>
									</div>
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="grid gap-2">
									<div class="grid gap-1">
										<Label>Quantity</Label>
										<Input type="number" bind:value={$form.items[i].quantity} />
										{#if $errors?.items?.[i]?.quantity}
											<p class="text-xs text-red-600">{$errors.items[i].quantity}</p>
										{/if}
									</div>

									<div class="grid gap-1">
										<Label>Custom Image</Label>
										<Input bind:value={$form.items[i].customImageUrl} />
										<span class="text-xs text-muted-foreground">
											If your asset has a custom image, you can provide a link to the image here.
										</span>
									</div>

									<div class="grid gap-1">
										<div class="flex items-center gap-1">
											<Label>U / U / U</Label>
											<Switch bind:checked={$form.items[i].u3} />
										</div>
										<span class="text-xs text-muted-foreground">
											Your standard Undocked, Unprotected, Undamaged acknowledgement.
										</span>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					</div>

					<div class="flex justify-center">
						<Separator class="w-2/3 rounded-md bg-primary" />
					</div>
				{/each}
			</div>
		</ScrollArea>
	</div>

	<!-- <SuperDebug data={$form} /> -->
</LayoutWrapper>
