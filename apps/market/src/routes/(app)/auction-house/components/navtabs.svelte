<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';

	type Props = {
		tab: 'dashboard' | 'auction-house' | 'new';
	};

	let { tab }: Props = $props();
</script>

<Tabs.Root value={tab}>
	<Tabs.List>
		<Tabs.Trigger
			value="dashboard"
			onmouseenter={async () => {
				await preloadData('/auction-house/dashboard');
			}}
			onclick={async () => {
				await goto('/auction-house/dashboard');
			}}
		>
			My Dashboard
		</Tabs.Trigger>
		<Tabs.Trigger
			value="auction-house"
			onmouseenter={async () => {
				await preloadData('/auction-house/listings');
			}}
			onclick={async () => {
				await goto('/auction-house/listings');
			}}>Browse Listings</Tabs.Trigger
		>
	</Tabs.List>
</Tabs.Root>
