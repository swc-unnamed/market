<script lang="ts">
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, enhance } = superForm(data.form, {
		dataType: 'json',
		onResult: ({ result }) => {
			switch (result.type) {
				case 'success':
					toast('Settings saved!');
					break;
				case 'error':
					toast.error('An error occurred while saving settings.');
					break;
				case 'failure':
					toast.error('An error occurred while saving settings.');
					break;
			}
		}
	});
</script>

<PageWrapper title="System Settings">
	<form action="?/update" method="post" use:enhance>
		<Card.Root>
			<Card.Content>
				<div class="flex flex-col gap-2">
					<Label>Auction Webhook URL</Label>
					<Input bind:value={$form.auctionWebhookUrl} />
					<span class="text-sm">
						This URL is what will be used in the live auction screen. When you click <span
							class="text-primary">Send to Discord</span
						>, this URL will be used to send the auction to the Discord channel.
					</span>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-end">
				<Button size="sm" type="submit">Save</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</PageWrapper>
