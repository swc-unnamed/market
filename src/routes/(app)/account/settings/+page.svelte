<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
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
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userHooksSchema } from '$lib/models/zod/users/user-hooks.schema.js';
	import { WebhookEvent } from '$lib/consts/webhook-event.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { toast } from 'svelte-sonner';
	import UserWebhookCard from '$lib/components/custom/account/user-webhook-card.svelte';
	import { updateUserScopesSchema } from '$lib/models/zod/users/update-user-scopes.schema.js';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let record = $derived(data.record);
	let selectedTab = $state('combine');
	let scopes = $state(data.scopes);
	let registerHookDialogOpen = $state(false);

	const webhookForm = superForm(data.webhookForm, {
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

	const scopeForm = superForm(data.userScopeForm, {
		validators: zodClient(updateUserScopesSchema),
		dataType: 'json',
		onResult: ({ result }) => {
			console.log(result);
		}
	});

	const { form: webhookFormData, enhance: webhookFormEnhance } = webhookForm;
	const { form: scopeFormData, enhance: scopeFormEnhance } = scopeForm;

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
					<div class="flex items-center justify-between">
						<Tabs.TabsList>
							<Tabs.Trigger value="combine">Combine Sync</Tabs.Trigger>
							<Tabs.Trigger value="hooks">Webhooks</Tabs.Trigger>
						</Tabs.TabsList>

						<Button size="sm" variant="action" href="/account/settings/integrations">
							My Integrations
						</Button>
					</div>

					<Tabs.Content value="combine">
						<div class="mt-4">
							<div class="flex flex-col gap-3">
								<Separator class="bg-primary" />
								<div class="grid grid-cols-1 gap-1">
									<h3>Granted Scopes</h3>
									<p class="text-sm text-muted-foreground">
										Scopes are how we access resources from the Combine. You must explicitly grant
										these scopes to the holochain. Note: We do not store this data, it's encrypted
										and stored within your terminal (browser).
									</p>

									<p class="text-sm">
										Should you want to revoke access to any of these scopes, do so from the
										<a
											href="https://www.swcombine.com/members/actsettings/index.php?mode=ws"
											target="_blank"
										>
											SWCombine settings.
										</a>
									</p>
								</div>

								<div class="grid grid-cols-1 gap-2">
									{#each scopes as scope}
										<div class="flex flex-col rounded-md border p-2">
											<div class="mb-3 flex items-center gap-2">
												<Checkbox
													checked={scope?.allowed}
													disabled={scope?.scope.name === 'character_read'}
													onCheckedChange={(v) => {
														scopes = scopes.map((s) => {
															if (!s) return s;
															if (s?.scope === scope?.scope) {
																s.allowed = v;
																if (v) {
																	$scopeFormData.scopes = [...$scopeFormData.scopes, s.scope.name];
																} else {
																	$scopeFormData.scopes = $scopeFormData.scopes.filter(
																		(s) => s !== scope?.scope.name
																	);
																}
															}

															return s;
														});
													}}
												/>
												<h4 class="text-primary">{scope?.scope.name}</h4>
											</div>
											<p class="mb-1 text-sm">
												{@html scope?.scope.description}
											</p>
											{#if scope?.scope.inheritedPermissions && scope?.scope.inheritedPermissions.length > 0}
												<Separator class="my-2 bg-primary" />
												<div class="grid grid-cols-1 gap-1">
													<p>Inherited Scopes</p>
													<p class="text-xs text-muted-foreground">
														By granting this scope, you are also granting the following scopes.
														These are required for the scope to function properly and are
														automatically granted when you grant the parent scope.
													</p>
													{#each scope?.scope.inheritedPermissions as inheritedScope}
														<p class="text-sm">{inheritedScope.name}</p>
													{/each}
												</div>
											{/if}
										</div>
									{/each}

									<div class="flex justify-end">
										<form method="POST" action="?/updateCombineScopes" use:scopeFormEnhance>
											<Form.Field form={scopeForm} name="scopes">
												<Form.Control>
													<Form.Button size="sm" variant="action">
														<Icon icon="tabler:refresh" />
														Update Scopes
													</Form.Button>
												</Form.Control>
											</Form.Field>
										</form>
									</div>
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
										<Dialog.Trigger class={buttonVariants({ size: 'sm', variant: 'action' })}>
											Register Hook
										</Dialog.Trigger>
										<Dialog.Content>
											<Dialog.Header>
												<Dialog.Title>Register Hook</Dialog.Title>
												<Dialog.Description>
													Register a new webhook subscription.
												</Dialog.Description>
											</Dialog.Header>

											<form method="POST" action="?/registerHook" use:webhookFormEnhance>
												<Form.Field form={webhookForm} name="name">
													<Form.Control>
														{#snippet children({ props })}
															<Form.Label>Name</Form.Label>
															<Input {...props} bind:value={$webhookFormData.name} />
														{/snippet}
													</Form.Control>
													<Form.Description>
														An easily identifiable name for your hook
													</Form.Description>
													<Form.FieldErrors />
												</Form.Field>

												<Form.Field form={webhookForm} name="webhook">
													<Form.Control>
														{#snippet children({ props })}
															<Form.Label>Webhook</Form.Label>
															<Input
																{...props}
																class="overflow-hidden"
																bind:value={$webhookFormData.webhook}
															/>
														{/snippet}
													</Form.Control>
													<Form.Description>The URL of your webhook.</Form.Description>
													<Form.FieldErrors />
												</Form.Field>

												<Form.Field form={webhookForm} name="events">
													{#each WebhookEvent as event}
														{@const checked = $webhookFormData.events.includes(event)}
														<div class="flex flex-row items-center gap-3">
															<Form.Control>
																{#snippet children({ props })}
																	<Checkbox
																		{...props}
																		{checked}
																		value={event}
																		onCheckedChange={(v) => {
																			if (v) {
																				$webhookFormData.events = [
																					...$webhookFormData.events,
																					event
																				];
																			} else {
																				$webhookFormData.events = $webhookFormData.events.filter(
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
