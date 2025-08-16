<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import type { AuctionLiveStatus } from '$lib/database/prisma/enums';
	import { cn } from '$lib/utils/tw';

	interface Props {
		status: AuctionLiveStatus;
	}

	let { status }: Props = $props();

	const statusColorMap: Record<AuctionLiveStatus, string> = {
		Upcoming: 'bg-yellow-600 text-white',
		InProgress: 'bg-green-600 text-white',
		Completed: 'bg-gray-600 text-white',
		Cancelled: 'bg-red-600 text-white',
		Closed: 'bg-gray-700 text-white'
	};

	const statusTextMap: Record<AuctionLiveStatus, string> = {
		Upcoming: 'Upcoming',
		InProgress: 'In Progress',
		Completed: 'Completed',
		Cancelled: 'Cancelled',
		Closed: 'Closed'
	};
</script>

<Badge class={cn(statusColorMap[status])}>
	{statusTextMap[status]}
</Badge>
