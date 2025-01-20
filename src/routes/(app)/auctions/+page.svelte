<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import SnackbarActionButton from '$lib/components/custom/layout/snackbar-action-button.svelte';
</script>

<LayoutWrapper title="Current Auction Listings">
	{#snippet right()}
		<SnackbarActionButton />
	{/snippet}

	<p>Current Auctions and auctions that are coming soon.</p>
</LayoutWrapper>
