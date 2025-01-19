<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { format } from 'date-fns';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let { data } = $props();
</script>

<LayoutWrapper title={data.record?.name || 'User Details'}>
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<div class="flex items-center gap-2">
					<Avatar.Root class="h-12 w-12">
						<Avatar.Image src={data.record?.avatar} />
						<Avatar.Fallback>{data.record?.name[0]}{data.record?.name[1]}</Avatar.Fallback>
					</Avatar.Root>

					<div class="flex flex-col">
						<span>{data.record?.name}</span>
						<span class="text-sm">
							{data.record.role}
						</span>
					</div>
				</div>
			</Card.Title>
		</Card.Header>

		<Card.Content>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<Label>Join Date</Label>
					<Input value={format(data.record.joinDate, 'yyyy-MM-dd HH:mm')} readonly />
				</div>

				<div>
					<Label>Role</Label>
					<div class="flex gap-1">
						<Input value={data.record.role} readonly />
						<Button variant="secondary">Edit</Button>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<Label>Banned</Label>
					<Switch checked={data.record.banned} />
				</div>

				<div>
					<Label>Banned Reason</Label>
					<Input value={data.record.banned_reason} readonly />
				</div>
			</div>

			{#if ['Holochain Architect', 'Market Tzar'].includes(data.record.role)}
				<h3>SW Combine Grants</h3>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<Label>Granted Scopes</Label>
						<ul>
							<li class="text-xs">{data.record.scopes}</li>
						</ul>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</LayoutWrapper>
