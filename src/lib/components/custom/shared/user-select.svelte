<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input';

	type UserSelectProps = {
		users: { id: string; name: string }[];
		selectedUser?: { id: string; name: string };
	};
	let { users, selectedUser = $bindable() }: UserSelectProps = $props();

	let value = $state('');
	let search = $state('');
	let inputRef = $state<HTMLInputElement>(null!);

	let filteredUsers = $state(users);
	const triggerContent = $derived(users.find((x) => x.id === value)?.name ?? '');

	$effect(() => {
		if (search) {
			filteredUsers = users.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()));
		} else {
			filteredUsers = users;
		}
	});
</script>

<Select.Root
	type="single"
	name="patron"
	bind:value
	onValueChange={() => {
		selectedUser = users.find((x) => x.id === value);
	}}
>
	<Select.Trigger class="w-full">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Input
			class="mb-3 w-full"
			placeholder="Search for a Patron"
			bind:ref={inputRef}
			bind:value={search}
		/>

		{#each filteredUsers as user (user.id)}
			<Select.Item value={user.id} label={user.name}>{user.name}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
