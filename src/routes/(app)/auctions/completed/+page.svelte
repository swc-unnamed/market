<script lang="ts">
	import { goto } from '$app/navigation';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { Table, TableHeader, TableRow, TableCell, TableBody } from '$lib/components/ui/table';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import { format } from 'date-fns';

	let { data } = $props();
</script>

<PageWrapper title="Completed Auctions">
	<Card>
		<CardHeader>
			<CardTitle>Completed Auctions</CardTitle>
			<CardDescription>List of completed auctions.</CardDescription>
		</CardHeader>
		<CardContent>
			<Table>
				<TableHeader>
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell>Started</TableCell>
						<TableCell>Completed</TableCell>
						<TableCell>Pending Actions</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each data.auctions as auction}
						{@const pendingActions = auction.listings.filter(
							(l) => l.status !== 'completed'
						).length}
						<TableRow>
							<TableCell>{auction.title}</TableCell>
							<TableCell>{format(auction.startAt, 'yyyy-MM-dd HH:mm')}</TableCell>
							<TableCell
								>{auction.completedAt
									? format(auction.completedAt, 'yyyy-MM-dd HH:mm')
									: 'N/A'}</TableCell
							>
							<TableCell class={cn(pendingActions > 0 ? 'text-danger' : '')}
								>{pendingActions}</TableCell
							>
							<TableCell>
								<Icon
									onclick={async () => {
										await goto(`/auctions/${auction.id}/admin`);
									}}
									class="size-6 rounded-md hover:cursor-pointer hover:text-primary"
									icon="tabler:subtask"
								/>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</CardContent>
	</Card>
</PageWrapper>
