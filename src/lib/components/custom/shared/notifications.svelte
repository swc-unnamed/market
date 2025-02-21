<script lang="ts">
	import type { UserContext } from '$lib/stores';
	import { USER_CONTEXT } from '$lib/stores/contexts';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';

	const userContext = getContext<UserContext>(USER_CONTEXT);
</script>

<div class="flex items-center gap-2">
	<button
		class="rounded-md p-1 transition-colors duration-200 ease-in-out hover:bg-secondary"
		onclick={() => alert('Notifications')}
	>
		<Icon icon="tabler:gavel" class="size-6" />
	</button>
</div>
