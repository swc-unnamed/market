<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { createLiveAuctionSchema } from '../components/schemas';
	import { toast } from 'svelte-sonner';
	import { Switch } from '$lib/components/ui/switch';
	import * as Drawer from '$lib/components/ui/drawer';
	import { RadioTower } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { Label } from '$lib/components/ui/label';

	const { data } = $props();

	const form = superForm(data.createAuctionForm, {
		dataType: 'json',
		validators: zodClient(createLiveAuctionSchema),
		onError: ({ result }) => {
			console.log(result);
			toast.error('There was an error creating the auction. Please check the form and try again.');
		}
	});
	const { form: formData, enhance } = form;

	let edit = $state(false);
	let displayAuctionSheet = $state(true);
	const auction = $derived(data.auction);
	const selectedModeratorObject = $derived.by(() => {
		return data.availableModerators.find((mod) => mod.id === $formData.moderatorId);
	});
	const availableModerators = $derived.by(() => {
		return data.availableModerators.map((mod) => ({
			value: mod.id,
			label: mod.profile?.displayName || mod.username
		}));
	});
</script>

<PageWrapper
	title="Create Live Auction"
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
					<div class="flex items-center gap-3">
						<span>Edit</span>
						<Switch bind:checked={edit} />
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<form class="grid grid-cols-1 gap-4" action="?/create" method="post" use:enhance>
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

					<div class="flex justify-end gap-3">
						<Button size="sm" variant="destructive">End Auction</Button>
						<Button size="sm" variant="outline">
							<RadioTower />
							Broadcast Auction
						</Button>
					</div>
				</form>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Available Listings</Card.Title>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>AHLID</Table.Head>
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
								<Table.Cell>{listing.title}</Table.Cell>
								<Table.Cell>{1}</Table.Cell>
								<Table.Cell>{listing.minimumBid.toLocaleString()}</Table.Cell>
								<Table.Cell>{listing.anonymous ? 'Yes' : 'No'}</Table.Cell>
								<Table.Cell>
									<Button
										size="sm"
										onclick={() => {
											displayAuctionSheet = true;
										}}
									>
										Start Auction
									</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>

	<Drawer.Root bind:open={displayAuctionSheet}>
		<Drawer.Content class="h-2/3">
			<Drawer.Header>
				<Drawer.Title>Listing Management</Drawer.Title>
				<Drawer.Description>
					<Button size="sm" variant="outline">
						<RadioTower />
						Broadcast Listing
					</Button>
				</Drawer.Description>
			</Drawer.Header>
			<div class="grid grid-cols-1 gap-3 p-2">
				<div class="flex items-center justify-between">
					<h3 class="max-w-48 text-wrap">Listing Title</h3>
					<p>Credits To: Display Name</p>
					<p>Minimum Bid: 100,000</p>
				</div>
				<Separator />
				<div class="grid grid-cols-2 gap-3">
					<div class="grid grid-cols-1 gap-2">
						<h4>Description</h4>
						<p>This will be the listing description</p>
					</div>
					<div class="grid grid-cols-1 gap-2">
						<h4>Location</h4>
						<p>This will be the listing description</p>
					</div>
					<div class="col-span-2">
						<Separator />
					</div>
					<div class="grid grid-cols-1 gap-2">
						<Label>Winning Big</Label>
						<Input />
					</div>
					<div class="grid grid-cols-1 gap-2">
						<Label>Won By</Label>
						<Input />
					</div>
				</div>
			</div>
			<Drawer.Footer class="flex flex-row items-center justify-end">
				<Button size="sm" variant="destructive" onclick={() => (displayAuctionSheet = false)}>
					Close
				</Button>
				<Button size="sm" variant="outline">Save Changes</Button>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
</PageWrapper>
