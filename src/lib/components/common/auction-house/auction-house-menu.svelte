<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Menu, Plus, SatelliteDish, Shield } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	async function createDraft() {
		toast.loading('Creating draft listing...', {
			id: 'create-draft'
		});
		const response = await fetch(`/api/auction-house/listings/drafts`, {
			method: 'post'
		});

		if (!response.ok) {
			toast.error(`Failed to create draft listing`, {
				description: `Error: ${response.statusText}`
			});

			toast.error('Failed to create draft', {
				description: `Reason: ${response.statusText}`
			});

			return;
		}

		const data: { draftId: string } = await response.json();

		toast.dismiss('create-draft');

		await goto(`/auction-house/listings/${data.draftId}/edit`);
	}
</script>

<Button size="sm" variant="ghost" onclick={createDraft}>
	<Plus />
	Listing
</Button>
