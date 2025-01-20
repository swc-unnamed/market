<script lang="ts">
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<LayoutWrapper title="Settings">
	<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
		<Card.Root>
			<Card.Header>
				<Card.Title>Access Control</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>Access Control is where you can manage Patrons and their roles.</p>
			</Card.Content>
			<Card.Footer>
				<Button size="sm" href="/settings/access-control">Go to Access Control</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</LayoutWrapper>
