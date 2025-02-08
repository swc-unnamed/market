<script lang="ts">
	import { integerToCredit } from '$lib/helpers/currency-conversion';
	import AurebeshText from '../custom/shared/aurebesh-text.svelte';

	type Props = {
		value: number;
	};

	let { value }: Props = $props();
</script>

<div class="flex items-center">
	{integerToCredit(value)}
	<AurebeshText class="ml-2" text="$" />
</div>
