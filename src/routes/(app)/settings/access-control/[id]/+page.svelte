<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { format } from 'date-fns';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { formatRole } from '$lib/helpers/format-role.js';
	import { superForm } from 'sveltekit-superforms';
	import { RoleSelectOptions } from '$lib/consts/roles.js';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';

	let { data } = $props();

	//TODO: Probably should combine these but for now this is how i'm going to do it.

	const { form: updateUserForm, enhance: updateUserEnhance } = superForm(data.roleUpdateForm, {
		dataType: 'json',
		warnings: {
			duplicateId: false
		},
		onResult: ({ result }) => {
			console.log(result);
			if (result.type === 'success') {
				toast.success('Patron updated successfully');
			}

			if (result.type === 'error') {
				toast.error('Failed to update Patron!');
			}

			if (result.type === 'failure') {
				toast.error(result.data?.message);
			}
		}
	});

	const {
		form: banForm,
		enhance: banUserEnhance,
		submit: banSubmit
	} = superForm(data.banForm, {
		dataType: 'json',
		warnings: {
			duplicateId: false
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Patron updated successfully');
			}

			if (result.type === 'error') {
				toast.error('Failed to update Patron!');
			}

			if (result.type === 'failure') {
				toast.error(result.data?.message);
			}
		}
	});
</script>

<PageWrapper title={data.record?.name || 'User Details'}>
	{#snippet right()}
		<Button variant="action" href="/settings/access-control">Back</Button>
	{/snippet}

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
						<span class="text-sm text-primary">
							{formatRole(data.record?.role)}
						</span>
						<span class="text-xs text-muted-foreground">
							{data.record.combineId}
						</span>
					</div>
				</div>
			</Card.Title>
			<Card.Description>
				{#if data.record.banned}
					<span class="text-red-500"> Account is Banned </span>
				{/if}
			</Card.Description>
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
						<Select.Root type="single" bind:value={$updateUserForm.role}>
							<Select.Trigger
								>{$updateUserForm.role
									? formatRole($updateUserForm.role)
									: 'Role must be seleted'}</Select.Trigger
							>
							<Select.Content>
								{#each RoleSelectOptions as role}
									<Select.Item value={role.value}>{role.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if $updateUserForm.role !== data.record.role}
							<form action="?/updateRole" method="post" use:updateUserEnhance>
								<Button variant="action" type="submit">Save</Button>
							</form>
						{/if}
					</div>
				</div>

				<form
					class="col-span-2 flex w-full flex-col gap-3"
					action="?/ban"
					method="post"
					use:banUserEnhance
				>
					<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
						<div class="flex items-center gap-3">
							<Label>Banned</Label>
							<Switch bind:checked={$banForm.banned} />
						</div>
						<div class="col-span-2 flex flex-col gap-3">
							<Label>Banned Reason</Label>
							<Input bind:value={$banForm.bannedReason} />
						</div>
					</div>

					<div>
						<Button
							variant="action"
							onclick={(e) => {
								e.preventDefault();
								banSubmit();
							}}>Save Ban State</Button
						>
					</div>
				</form>
			</div>

			{#if ['holochain_architect', 'market_tzar'].includes(data.user.role)}
				<h3 class="mt-3">SW Combine Grants</h3>
				<div class="grid grid-cols-1 gap-3">
					<Label>Granted Scopes</Label>
					<ul>
						{#each data.record.scopes as scope}
							<li class="text-xs">{scope}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</PageWrapper>
