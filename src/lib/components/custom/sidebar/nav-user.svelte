<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import Icon from '@iconify/svelte';
	import type { UserContext } from '$lib/stores';
	import { getContext } from 'svelte';
	import { USER_CONTEXT } from '$lib/stores/contexts';

	const user = getContext<UserContext>(USER_CONTEXT);

	const sidebar = useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem class="flex items-center gap-3">
		<Avatar.Root class="h-8 w-8 rounded-lg">
			<Avatar.Image src={user.avatar || '/assets/uim-animated.gif'} alt="Logo" />
			<Avatar.Fallback class="rounded-lg">UM</Avatar.Fallback>
		</Avatar.Root>
		<div class="flex flex-1 items-center justify-between truncate text-left text-sm leading-tight">
			<span class="truncate font-semibold">{user.name}</span>
		</div>
	</Sidebar.MenuItem>
</Sidebar.Menu>
