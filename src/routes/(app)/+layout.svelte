<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/custom/sidebar/app-sidebar.svelte';

	import { setContext } from 'svelte';
	import type { UserContext } from '$lib/stores';
	import { USER_CONTEXT } from '$lib/stores/contexts';
	import Icon from '@iconify/svelte';
	let { children, data } = $props();

	setContext<UserContext>(USER_CONTEXT, data.user);
</script>

<Sidebar.Provider open={true}>
	<AppSidebar />
	{@render children?.()}
</Sidebar.Provider>

<!-- <div class="flex items-center justify-center bg-sidebar p-8 md:justify-end">
	<div class="flex items-center gap-2">
		<span class="text-red-500">ALPHA</span>
		<a href="https://discord.gg/dSmbQ22TJB" class="flex items-center gap-1 text-xs text-foreground">
			<Icon icon="mdi:discord" class="size-4" />
			<span>Connect on Discord</span>
		</a>
		<a
			class="flex items-center gap-1 text-xs text-foreground"
			target="_blank"
			href="https://www.swcombine.com"
		>
			<Icon icon="mdi:external-link" class="size-4" />
			<span>Star Wars Combine</span>
		</a>
	</div>
</div> -->
