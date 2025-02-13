<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { Button } from '$lib/components/ui/button';
	import AurebeshText from '$lib/components/custom/shared/aurebesh-text.svelte';
	import { integerToCredit } from '$lib/helpers/currency-conversion.js';
	import { goto } from '$app/navigation';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	let { data } = $props();

	const perPage = 50;

	let currentPage = $state(1);

	const paginatedListings = $derived.by(() => {
		const start = (currentPage - 1) * perPage;
		const end = start + perPage;
		return data.auctions.slice(start, end);
	});
</script>

<div class="flex justify-between items-center">
	<div>
		<Pagination.Root count={data.auctions.length} perPage={perPage} bind:page={currentPage}>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton>
							<ChevronLeft class="size-4" />
							<span class="hidden sm:block">Previous</span>
						</Pagination.PrevButton>
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton>
							<span class="hidden sm:block">Next</span>
							<ChevronRight class="size-4" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	</div>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="mb-3">
			<Button class="items-center" size="sm" variant="outline">
				<AurebeshText class="mb-1.5 text-lg" text="F" />
				Filter
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Item onclick={async () => goto('/account/ledger/auctions')}>View All</DropdownMenu.Item>
			<DropdownMenu.Item onclick={async () => goto('/account/ledger/auctions?filter=purchased')}
			>View Purchased
			</DropdownMenu.Item
			>
			<DropdownMenu.Item onclick={async () => goto('/account/ledger/auctions?filter=sold')}
			>View Sold
			</DropdownMenu.Item
			>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
<div class="grid grid-cols-1 gap-3 md:grid-cols-2">

	<div class="col-span-2">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Cell class="w-28">ALID</Table.Cell>
					<Table.Cell class="w-32">Type</Table.Cell>
					<Table.Cell class="w-56">Title</Table.Cell>
					<Table.Cell>Final Price</Table.Cell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each paginatedListings as al}
					<Table.Row>
						<Table.Cell>{al.listingNumber}</Table.Cell>
						<Table.Cell>
							{#if al.listedById === data.user.id}
								Sold
							{:else}
								Purchased
							{/if}
						</Table.Cell>
						<Table.Cell>{al.title}</Table.Cell>
						<Table.Cell>
							<AurebeshText class="text-primary" text="$" />
							{integerToCredit(al.purchasedPrice || 0)}
						</Table.Cell>
						<Table.Cell>
							<Button size="sm" variant="outline" href={`/auctions/listings/${al.id}`}>View</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
