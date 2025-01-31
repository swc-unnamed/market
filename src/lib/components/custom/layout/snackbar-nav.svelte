<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import AurebeshText from '../shared/aurebesh-text.svelte';
	import Icon from '../shared/icon.svelte';

	type Links = {
		href: string;
		label: string;
	}[];

	let { links }: { links: Links } = $props();
	const isMobile = new IsMobile();
</script>

{#if isMobile.current}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button size="sm" variant="outline">
				<div class="flex items-center gap-2">
					<AurebeshText text="T" />
				</div>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content sideOffset={4} alignOffset={-4} class="mr-4">
			{#each links as link}
				<DropdownMenu.Item class="hover:cursor-pointer" onclick={async () => await goto(link.href)}>
					{link.label}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
	<div>
		{#if links.length > 2}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button size="sm" variant="outline">
						<div class="flex items-center gap-2">
							<AurebeshText text="T" />
							<span>Terminal</span>
						</div>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content sideOffset={4} alignOffset={-4} class="mr-4">
					{#each links as link}
						<DropdownMenu.Item
							class="hover:cursor-pointer"
							onclick={async () => await goto(link.href)}
						>
							{link.label}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<div class="flex flex-row items-center">
				{#each links as link}
					<Button size="sm" variant="action" href={link.href}>
						{link.label}
					</Button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
