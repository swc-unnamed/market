<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Icon from '@iconify/svelte';
	import Header from './nav-header.svelte';
	import NavMain from './nav-main.svelte';
	import type { ComponentProps } from 'svelte';
	import NavUser from './nav-user.svelte';
	import type { UserContext } from '$lib/stores';
	import NavSettings from './nav-settings.svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root class="z-50" bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<Header />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavSettings />
		<NavUser />
	</Sidebar.Footer>
</Sidebar.Root>
