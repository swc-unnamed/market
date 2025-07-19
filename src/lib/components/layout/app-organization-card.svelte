<script lang="ts">
	import * as Avatar from '../ui/avatar';

	type Props = {
		id: string;
		name: string;
		slug: string;
		logoId: string | null;
		logoUrl: string | null;
	};

	const { id, logoId, name, slug, logoUrl }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<Avatar.Root>
		<Avatar.Image src={logoId ? `/api/storage/${logoId}` : logoUrl ? logoUrl : ''} />
		<Avatar.Fallback>{name[0]}</Avatar.Fallback>
	</Avatar.Root>
	<div class="grid flex-1 text-left text-sm leading-tight">
		<span class="truncate font-semibold">
			{name}
		</span>
		<span class="text-xs">@{slug}</span>
	</div>
</div>
