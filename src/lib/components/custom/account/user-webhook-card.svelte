<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	type Props = {
		hook: {
			id: string;
			name: string;
			userId: string;
			type: 'discord';
			webhook: string;
			events: string[];
			createdAt: Date;
			lastUsed: Date;
			successCount: number | null;
			failureCount: number | null;
		};
		action: string;
		depends?: string;
	};

	let { hook, action, depends }: Props = $props();
	let dialogOpen = $state(false);
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-row items-center justify-between rounded-md border p-2">
		<div class="flex flex-col">
			<div class="mb-3 flex flex-col">
				<h4 class="text-primary">{hook.name}</h4>
				<p class="text-xs text-muted-foreground">{hook.webhook}</p>
			</div>
			<p class="text-sm">Events: {hook.events.join(', ')}</p>
		</div>

		<AlertDialog.Root bind:open={dialogOpen}>
			<AlertDialog.Trigger>
				<Button size="sm" variant="action" class="text-danger">Delete</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<form
						{action}
						method="POST"
						use:enhance={() => {
							return async ({ result, update }) => {
								switch (result.type) {
									case 'success':
										dialogOpen = false;
										toast('Hook has been deleted');
										if (depends) {
											await invalidate(depends);
										}
										break;
									case 'error':
										toast.error('An error occurred when trying to delete the webhook.');
										console.log(result.error);
										break;
									case 'failure':
										toast.error('Failed to delete hook');
										break;
								}
							};
						}}
					>
						<AlertDialog.Action name="id" value={hook.id}>Yes, Delete</AlertDialog.Action>
					</form>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</div>
</div>
