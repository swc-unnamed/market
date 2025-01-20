<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { page as pageState } from '$app/state';
	import type { PaginatedMeta } from '$lib/models/general/paginated-meta';
	import Icon from '@iconify/svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { debounce } from '$lib/helpers/debounce';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	interface Props {
		searchTerm?: string;
		originalData: { records: unknown; meta: PaginatedMeta };
		placeholder?: string;
		inputProps?: string | undefined;
		class?: HTMLAttributes<HTMLFormElement>['class'];
	}

	let { searchTerm = $bindable() }: Props = $props();

	const search = async () => {
		if (searchTerm) {
			let currentUrl = new URL(pageState.url);
			currentUrl.searchParams.set('q', searchTerm);

			if (currentUrl.searchParams.has('page')) {
				currentUrl.searchParams.delete('page');
			}

			await goto(currentUrl.toString());
		} else {
			let currentUrl = new URL(pageState.url);
			currentUrl.searchParams.delete('q');
			await goto(currentUrl.toString());
		}
	};
</script>

<form
	id="searchForm"
	onsubmit={(e) => {
		e.preventDefault();
		search();
	}}
	class={'relative mx-auto mb-1 flex max-w-96 items-center space-x-2 rounded-md font-medium md:mb-0'}
>
	<Input id="searchInput" bind:value={searchTerm} />

	<div class="absolute right-0 flex items-center justify-center">
		<Button class="text-muted-foreground" variant="ghost" size="icon" type="submit">
			<Icon class="text-muted-foreground" icon="mdi:magnify" />
		</Button>
	</div>
</form>
