<script lang="ts">
	import { page } from '$app/state';
	import LayoutWrapper from '$lib/components/custom/layout/layout-wrapper.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	let activeAccordion = $state<string | undefined>(undefined);

	$effect(() => {
		const hash = page.url.hash.slice(1);

		if (hash) {
			activeAccordion = hash;
		}
	});

	function handleAccordionChange(value: string) {
		console.log(value);
		if (!value) {
			window.location.hash = '';
		} else {
			activeAccordion = value;

			// Set the hash in the URL
			window.location.hash = value;
		}
	}
</script>

<LayoutWrapper title="Help">
	<Accordion.Root
		type="single"
		bind:value={activeAccordion}
		onValueChange={handleAccordionChange}
		class="w-full"
	>
		<Accordion.Item id="combine-id" value="combine-id">
			<Accordion.Trigger name="combine-id">Why do you ask for the Combine ID?</Accordion.Trigger>
			<Accordion.Content>
				<div class="flex flex-col gap-2">
					<p>
						The Combine ID is a unique identifier that helps us track the asset on the Holochain.
						It's not required, but it's a staple of the Unnamed Market.
					</p>
					<p>
						This is what we are trying to build here, a market and trading platform that can track a
						single asset. Who knows, that battle droid you just purchased might have been a part of
						a larger story or battle.
					</p>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</LayoutWrapper>
