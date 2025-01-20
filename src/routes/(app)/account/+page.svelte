<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { format } from 'date-fns';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';

	let { data } = $props();

	let record = $derived(data.record);
</script>

<LayoutWrapper title="Account">
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<div class="flex items-center gap-2">
					<Avatar.Root class="h-32 w-32">
						<Avatar.Image src={record.avatar} />
						<Avatar.Fallback>{record.name[0]}{record.name[1]}</Avatar.Fallback>
					</Avatar.Root>
					<div class="flex flex-col gap-1">
						<p>{record?.name}</p>
						<p class="text-sm">{format(record?.joinDate, 'yyyy-MM-dd HH:mm')}</p>
						<p class="text-sm">Rating: 100%</p>
					</div>
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="w-48">
				<div class="grid grid-cols-2 gap-2">
					<p>Account ID:</p>
					<p>{record?.id}</p>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<p>Combine ID:</p>
					<p>{record?.combineId}</p>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<p>Discord ID:</p>
					<p>{record?.discordId}</p>
				</div>
			</div>

			<div class="mt-4">
				<div class="flex flex-col gap-3">
					<Separator class="bg-primary" />
					<h3>Granted Scopes</h3>

					<div class="flex flex-row items-center justify-between rounded-md border p-2">
						<div class="flex flex-col">
							<h4 class="text-primary">Character Read</h4>
							<p>This is required to be able to login.</p>
						</div>

						<Switch checked class="data-[state=checked]:bg-green-600" disabled />
					</div>

					<div class="flex flex-row items-center justify-between rounded-md border p-2">
						<div class="flex flex-col">
							<h4 class="text-primary">Personal Inventory Overview</h4>
							<p>
								We use this to help you list assets from your inventory to sell on the market. We do
								not store your inventory data and is pulled on demand.
							</p>
							<p class="text-red-500">Not Implemented Yet</p>
						</div>

						<Switch class="data-[state=checked]:bg-green-600" disabled />
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</LayoutWrapper>
