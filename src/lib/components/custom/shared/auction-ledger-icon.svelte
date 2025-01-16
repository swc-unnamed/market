<script lang="ts">
	import Icon from '@iconify/svelte';

	type AuctionLedgerIconProps = {
		event: string;
	};

	let { event }: AuctionLedgerIconProps = $props();

	let icon = $state<string | null>(null);

	$effect(() => {
		// Set the icon based on the event

		switch (event) {
			case 'created':
				icon = 'mdi:package-check';
				break;

			default:
				icon = null;
				break;
		}
	});
</script>

{#if icon}
	<Icon {icon} width="24" height="24" />
{/if}
