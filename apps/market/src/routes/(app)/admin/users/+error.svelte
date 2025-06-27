<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
</script>

<PageWrapper title="Error">
	<div class="h-48 w-full text-center">
		<div class="flex flex-col items-center justify-center">
			<p>{page.error?.message}</p>
			<Button size="sm" variant="outline">Go Home</Button>
		</div>
	</div>
</PageWrapper>
