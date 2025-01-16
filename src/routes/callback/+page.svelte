<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		setTimeout(async () => {
			await goto('/');
		}, 1000);
	});
</script>

<div class="mx-auto w-full pt-4">
	<p class="text-center">Authenticating you against current holonet records...</p>
</div>
