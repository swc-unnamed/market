<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import SnackbarActionButton from '$lib/components/custom/layout/snackbar-action-button.svelte';

	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';

	let { data } = $props();
</script>

<LayoutWrapper title="Home" displayTitle={false}>
	<div class="space-y-4">
		<div class="flex justify-center">
			<img class="w-2/3 rounded-lg" src={'/assets/unnamed-banner.png'} alt="Banner" />
		</div>
		<Alert.Root>
			<Alert.Title>Hey {data.user.name}, got something to tell you</Alert.Title>
			<Alert.AlertDescription>
				<p>
					The Unnamed Imperium Market is under heavy, like <span class="font-bold">HEAVY</span> development.
					I'm not really sure what I'm going to put here, so if you want to help me out with ideas, let
					me know. This home page should be user-focused.
				</p>
			</Alert.AlertDescription>
		</Alert.Root>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		<Card.Root>
			<Card.Header>
				<Card.Title>Card Title</Card.Title>
				<Card.Description>
					<span style="font-family: 'Galactic Basic'">$ 10,000,000</span>
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>List out some type of card content or something</p>
			</Card.Content>
		</Card.Root>
	</div>
</LayoutWrapper>
