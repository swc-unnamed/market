<script lang="ts">
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { enhance as formEnhance } from '$app/forms';
	import { requestIntegrationSchema } from '$lib/models/zod/integrations/request-integration.schema.js';
	import { SwcTimestamp } from 'swcombine.js';

	let integrationDialogOpen = $state(false);
	let { data } = $props();

	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(requestIntegrationSchema),
		onResult: ({ result }) => {
			console.log(result);
			integrationDialogOpen = false;
		}
	});

	const { form: formData, enhance } = form;
</script>

<PageWrapper title="Integrations">
	{#snippet right()}
		<Button variant="action" size="sm" href={`/account/settings`}>Back</Button>
	{/snippet}
	<Card.Root>
		<Card.Header>
			<Card.Title>Unnamed Market Integrations</Card.Title>
			<Card.Description>
				We have a limited integration API, but we are working on it. It may or may not grow with
				time. Not sure yet. Integrations must be approved by a Holochain Architect or higher.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-1 gap-3">
				<div class="flex justify-end">
					<Dialog.Root bind:open={integrationDialogOpen}>
						<Dialog.Trigger class={buttonVariants({ variant: 'action', size: 'sm' })}>
							Request Integration
						</Dialog.Trigger>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Integration Request</Dialog.Title>
								<Dialog.Description>
									<p>
										Fill out the following. This will be sent to the Unnamed staff and we will get
										it approved as soon as possible. Or not, really just depends.
									</p>
								</Dialog.Description>
							</Dialog.Header>
							<form method="post" action="?/requestIntegration" use:enhance>
								<Form.Field {form} name="name">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Name</Form.Label>
											<Input {...props} bind:value={$formData.name} />
										{/snippet}
									</Form.Control>
								</Form.Field>

								<Form.Field {form} name="name">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Description</Form.Label>
											<Textarea {...props} bind:value={$formData.description} />
										{/snippet}
									</Form.Control>
									<Form.Description>
										Provide a brief description of what your integration will do.
									</Form.Description>
								</Form.Field>

								<Form.Field {form} name="name">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Scopes</Form.Label>
											<div class="flex items-center gap-2">
												<Checkbox
													{...props}
													checked={$formData.scopes.includes('user_read') ? true : false}
													onCheckedChange={(v) => {
														if (v) {
															$formData.scopes = [...$formData.scopes, 'user_read'];
														} else {
															$formData.scopes = $formData.scopes.filter((s) => s !== 'user_read');
														}
													}}
												/>
												<div class="flex flex-col">
													<span class="text-sm">user_read</span>
													<span class="text-xs text-muted-foreground"> Read basic user data </span>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<Checkbox
													{...props}
													checked={$formData.scopes.includes('user_create') ? true : false}
													onCheckedChange={(v) => {
														if (v) {
															$formData.scopes = [...$formData.scopes, 'user_create'];
														} else {
															$formData.scopes = $formData.scopes.filter(
																(s) => s !== 'user_create'
															);
														}
													}}
												/>
												<div class="flex flex-col">
													<span class="text-sm">user_create</span>
													<span class="text-xs text-muted-foreground">
														Register a user with the platform
													</span>
												</div>
											</div>
										{/snippet}
									</Form.Control>
								</Form.Field>
								<Dialog.Footer>
									<Button
										class="text-danger"
										variant="link"
										onclick={() => (integrationDialogOpen = false)}
									>
										Cancel
									</Button>
									<Button variant="action" type="submit">Request</Button>
								</Dialog.Footer>
							</form>
						</Dialog.Content>
					</Dialog.Root>
				</div>
				<Table.Root>
					<Table.Header class="bg-sidebar">
						<Table.Row>
							<Table.Cell>Name</Table.Cell>
							<Table.Cell>Approved</Table.Cell>
							<Table.Cell>Access Token</Table.Cell>
							<Table.Cell>Scopes</Table.Cell>
							<Table.Cell>Last Used</Table.Cell>
							<Table.Cell>Success</Table.Cell>
							<Table.Cell>Failure</Table.Cell>
							<Table.Cell></Table.Cell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.integrations as integration}
							<Table.Row>
								<Table.Cell>{integration.name}</Table.Cell>
								<Table.Cell>{integration.approved ? 'Yes' : 'No'}</Table.Cell>
								<Table.Cell>
									<span class="blur-sm hover:blur-none">
										{integration.accessToken}
									</span>
								</Table.Cell>
								<Table.Cell>
									<div class="grid grid-cols-1 gap-1">
										{#each integration.scopes as scope}
											<span class="text-xs">{scope}</span>
										{/each}
									</div>
								</Table.Cell>
								<Table.Cell>{SwcTimestamp.fromDate(integration.createdAt).toString()}</Table.Cell>
								<Table.Cell>{integration.successCount}</Table.Cell>
								<Table.Cell>{integration.failureCount}</Table.Cell>
								<Table.Cell>
									<AlertDialog.Root>
										<AlertDialog.Trigger
											class={buttonVariants({
												variant: 'link',
												class: 'text-danger'
											})}
										>
											Delete
										</AlertDialog.Trigger>
										<AlertDialog.Content>
											<AlertDialog.Header>
												<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
												<AlertDialog.Description>
													This action cannot be undone. The Access Token will be revoked and will be <span
														class="text-danger">immediately unusable</span
													>.
												</AlertDialog.Description>
											</AlertDialog.Header>
											<AlertDialog.Footer>
												<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
												<form
													method="post"
													action={`?/revokeIntegration&id=${integration.id}`}
													use:formEnhance
												>
													<AlertDialog.Action type="submit" class="bg-danger">
														Delete
													</AlertDialog.Action>
												</form>
											</AlertDialog.Footer>
										</AlertDialog.Content>
									</AlertDialog.Root>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</Card.Content>
	</Card.Root>
</PageWrapper>
