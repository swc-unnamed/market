<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { getContext } from 'svelte';
	import type { UserContext } from '$lib/stores';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import CreditInput from '$lib/components/custom/inputs/credit-input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { blur } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import AssetLookup from '$lib/components/custom/shared/entity-lookup.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Icon from '$lib/components/custom/shared/icon.svelte';
	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { newAuctionListingSchema } from '$lib/models/zod/auctions';
	import { USER_CONTEXT } from '$lib/stores/contexts';
	import * as Drawer from '$lib/components/ui/drawer/index.js';

	import {
		CombineEntityTypeArray,
		convertCombineEntityTypeToApiValue
	} from '$lib/consts/combine/entity-type';
	import * as Select from '$lib/components/ui/select/index.js';
	import ListingPreviewCard from '$lib/components/custom/auctions/listing-preview-card.svelte';

	const user = getContext<UserContext>(USER_CONTEXT);
	let { data } = $props();
	let previewOpen = $state(false);

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
		previewOpen = false;
	}
</script>

<LayoutWrapper
	title="New Auction Listing"
	subTitle="Create a new listing to be picked up in an upcoming auction."
>
	<form method="POST" action="?/createListing" use:enhance></form>

	<div class="grid gap-3">
		<Alert.Root class="border-blue-500">
			<Alert.Title class="flex items-center">
				<Icon icon="mdi:info-outline" class="mr-2 h-6 w-6 text-blue-600" />
				Welcome to the Holochain Terminal, {user.name}
			</Alert.Title>
			<Alert.Description>
				Input the following parameters and our droids will take care of the rest. Take your time
				though, once you have submitted the listing to holochain, you will not be able to change it.
			</Alert.Description>
		</Alert.Root>

		<div class="grid grid-cols-1 gap-2 lg:grid-cols-1">
			<div>
				<div class="grid grid-cols-1 gap-2">
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

						<Card.Footer class="flex justify-end gap-2">
							<Button
								class="flex items-center"
								variant="secondary"
								onclick={() => {
									$form.items = [
										...$form.items,
										{
											entityId: '',
											entityName: '',
											uuu: true,
											quantity: 1,
											customImageUrl: '',
											asset: {
												type: '',
												combineId: null
											}
										}
									];
								}}
							>
								<Icon icon="mdi:invoice-text-new-outline" class="size-4" />
								Add Asset
							</Button>
						</Card.Footer>
					</Card.Root>
				</div>
			</div>

			<ScrollArea>
				<div class="grid grid-cols-1 gap-2">
					{#each $form.items as item, i}
						<div transition:blur={{ duration: 150, easing: cubicOut }}>
							<Card.Root>
								<Card.Header>
									<Card.Title>
										<div class="flex items-center justify-between">
											{#if $form.items[i].entityId}
												<span
													>{data.entities.find((x) => x.id == $form.items[i].entityId)?.name}</span
												>
											{:else}
												<span>Asset {i + 1}</span>
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
												<AssetLookup
													bind:value={$form.items[i].entityId}
													bind:name={$form.items[i].entityName}
													entity={data.entities}
												/>
											</div>
										</div>
									</Card.Title>
								</Card.Header>
								<Card.Content>
									<div class="grid gap-2">
										{#if $errors?.items?.[i]?.entityId}
											<p class="text-xs text-red-600">{$errors.items[i].entityId}</p>
										{/if}
										<div class="grid gap-1">
											<Label>Combine ID</Label>
											<Input type="number" bind:value={$form.items[i].asset.combineId} />
											{#if $errors?.items?.[i]?.asset?.combineId}
												<p class="text-xs text-red-600">{$errors.items[i].asset.combineId}</p>
											{/if}
										</div>

										<div class="grid gap-1">
											<Label>Asset Type</Label>
											<Select.Root
												type="single"
												bind:value={$form.items[i].asset.typeId}
												onValueChange={(v) => {
													// Get the type from the array
													const type = CombineEntityTypeArray.find((x) => x.value.toString() == v);

													if (type) {
														$form.items[i].asset.type = convertCombineEntityTypeToApiValue(
															type.value
														);
													}
												}}
											>
												<Select.Trigger>
													{#if $form.items[i].asset.typeId}
														{CombineEntityTypeArray.find(
															(x) => x.value.toString() == $form.items[i].asset.typeId
														)?.label}
													{:else}
														Select an Asset Type
													{/if}
												</Select.Trigger>
												<Select.Content>
													{#each CombineEntityTypeArray as type}
														<Select.Item value={type.value.toLocaleString()}
															>{type.label}</Select.Item
														>
													{/each}
												</Select.Content>
											</Select.Root>

											<input class="hidden" bind:value={$form.items[i].asset.type} />

											{#if $errors?.items?.[i]?.asset?.typeId}
												<p class="text-xs text-red-600">{$errors.items[i].asset.typeId}</p>
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
												<Switch bind:checked={$form.items[i].uuu} />
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
	</div>

	<div class="fixed bottom-6 left-1/2 -translate-x-1/2">
		<Drawer.Root bind:open={previewOpen}>
			<Drawer.Trigger>
				<div class="traced-button-wrapper">
					<div class="traced-button-gradient">
						<Button
							variant="outline"
							class="relative w-96 border-primary bg-background transition-colors duration-200"
						>
							<Icon icon="mage:preview" />
							Preview Listing
						</Button>
					</div>
				</div>
			</Drawer.Trigger>
			<Drawer.Content class="mx-auto h-3/4 w-full md:w-2/3">
				<ScrollArea>
					<div class="container mx-auto w-full">
						<Drawer.Header>
							<Drawer.Title>Listing Preview</Drawer.Title>
							<Drawer.Description
								>Preview your listing before you submit it. Once submitted, it will be on a cooldown
								before being submitted to the holochain.
							</Drawer.Description>
						</Drawer.Header>

						<Separator class="mb-3 bg-primary" />

						<ListingPreviewCard bind:listing={$form} />
					</div>

					<div class="mx-auto w-96">
						<Drawer.Footer>
							<Button onclick={handleSubmit}>Submit</Button>
							<Drawer.Close>Cancel</Drawer.Close>
						</Drawer.Footer>
					</div>
				</ScrollArea>
			</Drawer.Content>
		</Drawer.Root>
	</div>

	<!-- <div class="my-4">
		<SuperDebug data={$form} />
	</div> -->
</LayoutWrapper>
