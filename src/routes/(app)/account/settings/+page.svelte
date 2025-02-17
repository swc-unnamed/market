<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { format } from 'date-fns';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userHooksSchema } from '$lib/models/zod/users/user-hooks.schema.js';
	import { WebhookEvent } from '$lib/consts/webhook-event.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { toast } from 'svelte-sonner';
	import UserWebhookCard from '$lib/components/custom/account/user-webhook-card.svelte';

	let { data } = $props();
	let record = $derived(data.record);
	let selectedTab = $state('combine');
	let registerHookDialogOpen = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(userHooksSchema),
		dataType: 'json',
		onResult: ({ result }) => {
			console.log(result);
			switch (result.type) {
				case 'success':
					registerHookDialogOpen = false;
					toast(result.data?.message);
					break;
				case 'failure':
					toast.error(result.data?.message ?? 'An error occurred while registering the hook.');
					break;
			}
		}
	});

	const { form: formData, enhance } = form;

	onMount(async () => {
		const tab = page.url.searchParams.get('tab');

		if (tab) {
			selectedTab = tab;
		}

		const registerHook = page.url.searchParams.get('registerHook');

		if (registerHook) {
			registerHookDialogOpen = true;
		}
	});
</script>

<PageWrapper title="Account">
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<div class="flex items-center gap-2">
					<Avatar.Root class="h-32 w-32">
						<Avatar.Image src={record.avatar} />
						<Avatar.Fallback>{record.name[0]}{record.name[1]}</Avatar.Fallback>
					</Avatar.Root>
					<div class="flex flex-col gap-1">
						<p>{record?.name}</p>
						<p class="text-sm">{format(record?.joinDate, 'yyyy-MM-dd HH:mm')}</p>
						<p class="text-sm">Rating: 100%</p>
					</div>
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="w-48">
				<div class="grid grid-cols-2 gap-2">
					<p>Account ID:</p>
					<p>{record?.id}</p>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<p>Combine ID:</p>
					<p>{record?.combineId}</p>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<p>Discord ID:</p>
					<p>{record?.discordId}</p>
				</div>
			</div>

			<div class="mt-3">
				<Tabs.Root bind:value={selectedTab}>
					<Tabs.TabsList>
						<Tabs.Trigger value="combine">Combine Sync</Tabs.Trigger>
						<Tabs.Trigger value="hooks">Webhooks</Tabs.Trigger>
					</Tabs.TabsList>

					<Tabs.Content value="combine">
						<div class="mt-4">
							<div class="flex flex-col gap-3">
								<Separator class="bg-primary" />
								<h3>Granted Scopes</h3>

								<div class="grid grid-cols-1 gap-2">
									{#if data.scopes}
										{#each data.scopes as scope}
											{#if scope != undefined}
												<div
													class="flex flex-row items-center justify-between rounded-md border p-2"
												>
													<div class="flex w-full flex-col">
														<div class="mb-3 flex items-center gap-2">
															<Checkbox checked={scope.allowed} />
															<h4 class="text-primary">{scope?.scope.name}</h4>
															<!-- <Switch
																checked={scope.allowed}
																class="data-[state=checked]:bg-green-600"
																disabled
															/> -->
														</div>
														<p class="text-sm">
															{@html scope?.scope.description}
														</p>
													</div>
												</div>
											{/if}
										{/each}
									{/if}
								</div>
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="hooks">
						<div class="mt-4">
							<div class="flex flex-col gap-3">
								<Separator class="bg-primary" />
								<div class="flex items-center justify-between">
									<h3>Webhooks</h3>
									<Dialog.Root bind:open={registerHookDialogOpen}>
										<Dialog.Trigger>
											<Button size="sm" variant="action">Register Hook</Button>
										</Dialog.Trigger>
										<Dialog.Content>
											<Dialog.Header>
												<Dialog.Title>Register Hook</Dialog.Title>
												<Dialog.Description>
													Register a new webhook subscription.
												</Dialog.Description>
											</Dialog.Header>

											<form method="POST" action="?/registerHook" use:enhance>
												<Form.Field {form} name="name">
													<Form.Control>
														{#snippet children({ props })}
															<Form.Label>Name</Form.Label>
															<Input {...props} bind:value={$formData.name} />
														{/snippet}
													</Form.Control>
													<Form.Description>
														An easily identifiable name for your hook
													</Form.Description>
													<Form.FieldErrors />
												</Form.Field>

												<Form.Field {form} name="webhook">
													<Form.Control>
														{#snippet children({ props })}
															<Form.Label>Webhook</Form.Label>
															<Input
																{...props}
																class="overflow-hidden"
																bind:value={$formData.webhook}
															/>
														{/snippet}
													</Form.Control>
													<Form.Description>The URL of your webhook.</Form.Description>
													<Form.FieldErrors />
												</Form.Field>

												<Form.Field {form} name="events">
													{#each WebhookEvent as event}
														{@const checked = $formData.events.includes(event)}
														<div class="flex flex-row items-center gap-3">
															<Form.Control>
																{#snippet children({ props })}
																	<Checkbox
																		{...props}
																		{checked}
																		value={event}
																		onCheckedChange={(v) => {
																			if (v) {
																				$formData.events = [...$formData.events, event];
																			} else {
																				$formData.events = $formData.events.filter(
																					(e) => e !== event
																				);
																			}
																		}}
																	/>

																	<Form.Label class="font-normal">{event}</Form.Label>
																{/snippet}
															</Form.Control>
														</div>
													{/each}
												</Form.Field>

												<div class="flex justify-end">
													<Form.Button size="sm" variant="action">Register Hook</Form.Button>
												</div>
											</form>
										</Dialog.Content>
									</Dialog.Root>
								</div>
								<p>
									Webhook subscriptions allow you to subscribe to certain events that happen on the
									holochain. Please note, as of right now, the holochain
									<span class="text-primary">only supports Discord</span>
									webhooks.
								</p>

								{#each record?.webhooks as hook}
									<UserWebhookCard action="?/deleteHook" {hook} depends={'account'} />
								{/each}
							</div>
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</Card.Content>
	</Card.Root>
</PageWrapper>
