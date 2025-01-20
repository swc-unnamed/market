<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';
	import { page as pageStore } from '$app/state';
	import { goto } from '$app/navigation';
	import type { PaginatedMeta } from '$lib/models/general/paginated-meta';

	type Props = {
		meta: PaginatedMeta;
	};

	let { meta }: Props = $props();

	let { pageSize, totalPages } = $derived(meta);
</script>

{#if totalPages > 1}
	<Pagination.Root
		onPageChange={async (e) => {
			let currentUrl = new URL(pageStore.url);
			currentUrl.searchParams.set('page', e.toString());
			await goto(currentUrl.toString());
		}}
		count={pageSize * totalPages}
		perPage={pageSize}
	>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>

				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item isVisible={currentPage === page.value}>
							<Pagination.Link {page} isActive={currentPage === page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
{/if}
