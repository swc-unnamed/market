<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Icon from '@iconify/svelte';
	import Header from './nav-header.svelte';
	import NavMain from './nav-main.svelte';
	import type { ComponentProps } from 'svelte';
	import NavUser from './nav-user.svelte';
	import type { User } from '$lib/models/shared';

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
		<NavUser />
	</Sidebar.Footer>
</Sidebar.Root>
