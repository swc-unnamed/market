<script lang="ts">
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { data } = $props();
</script>

<PageWrapper
	title="Live Auction Settings"
	breadcrumb={[
		{
			title: 'Admin'
		},
		{
			title: 'Settings'
		}
	]}
>
	<Card.Root>
		<Card.Header>
			<Card.Title>Live Auction Settings</Card.Title>
			<Card.Description>As things move on, we will update this.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form class="grid grid-cols-1 gap-1" method="post" action="?/update" use:enhance>
				<Label>Broadcast Webhook Url</Label>
				<Input name="webhookUrl" value={data.settings?.broadcastWebhook} />
				<p class="text-muted-foreground text-sm">
					The Discord Webhook URL that is used to broadcast auction updatest and listing updates.
				</p>
				<div>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</PageWrapper>
