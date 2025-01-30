<script lang="ts">
	import { page } from '$app/state';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="spacey-y-3 mx-auto mt-4 max-w-7xl">
	<h1 class="text-center text-3xl font-bold">ERROR: {page.status}</h1>
	<p class="text-center">{page.error?.message}</p>

	<div class="flex items-center gap-3">
		<Button href="/home" variant="outline" size="sm" class="mt-3 w-full border-primary">
			<AurebeshText text="H" />
			<span>Go to the Main Holoterminal</span>
		</Button>
	</div>
</div>
