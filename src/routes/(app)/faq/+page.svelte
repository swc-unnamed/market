<script lang="ts">
	import { page } from '$app/state';
	import PageWrapper from '$lib/components/custom/layout/page-wrapper.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator';

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

<PageWrapper title="Frequently Asked Questions" displayTitle={false}>
	<Card.Root>
		<Card.Header>
			<Card.Title>FAQs</Card.Title>
			<Card.Description>
				We get it, you're going to have questions about what we are doing here. Our goal is to build
				a marketplace, auction house, and trading platform that is easy to use, heavily integrated,
				and immersive.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Accordion.Root
				type="single"
				bind:value={activeAccordion}
				onValueChange={handleAccordionChange}
				class="w-full"
			>
				<Accordion.Item id="holochain" value="holochain" class="border-none">
					<Accordion.Trigger name="combine-id">What is the Holochain?</Accordion.Trigger>
					<Accordion.Content class="rounded-md bg-secondary shadow-md">
						<div class="flex flex-col gap-2 p-4">
							<p>
								Glad you asked. The Holochain is what we call the ledger system that we created.
								This ledger system is used to track the history of an asset as it moves through our
								platform. Think of it as a chain of custody for your assets. You never know, that
								random piece of junk you just bought might have been a part of a larger story. Or it
								could just be a piece of junk, we don't judge.
							</p>
							<p>
								We don't track who the asset is assigned to or anything like that, and we only
								update the ledger when a Patron lists it for sale or auction. This way, you can see
								where the asset has been. We are trying to put a different spin on things here.
							</p>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item id="combine-id" value="combine-id" class="border-none">
					<Accordion.Trigger name="combine-id">Why do you ask for the Combine ID?</Accordion.Trigger
					>
					<Accordion.Content class="rounded-md bg-secondary shadow-md">
						<div class="flex flex-col gap-2 p-4">
							<p>
								The Combine ID is a unique identifier that is issued to every single Combine asset
								that is created. We use this ID to track the asset and its history on what we call
								the Holochain.
							</p>
							<p>
								This is what we are trying to build here, a market and trading platform that can
								track a single asset. Who knows, that battle droid you just purchased might have
								been a part of a larger story or battle.
							</p>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item id="combine-permissions" value="combine-permissions" class="border-none">
					<Accordion.Trigger name="combine-permissions">
						How does Unnamed use Combine permissions?
					</Accordion.Trigger>
					<Accordion.Content class="roundedmd bg-secondary shadow-md">
						<div class="grid grid-cols-1 gap-2 p-4">
							<p>
								We use the permissions that you grant us to access your Combine account to list your
								assets for sale or auction. We do not have access to your assets or any other
								information about your account without you performing an action on our platform.
							</p>
							<p>
								We do not store your access token or your refresh token, we save them directly to
								your browser as a cookie.
							</p>
							<p>
								While most of the permissions are self explanitory, we wanted to bring a special
								note to the
								<code class="text-muted-foreground">character_privileges</code> permission. This is used
								when you check your factions assets. If you do not have the ability to make over the
								entity type, we will not pull the faction inventory even if you can see them. The reason
								for this is you can't list them for sale or auction, if you can't makeover the asset.
							</p>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</PageWrapper>
