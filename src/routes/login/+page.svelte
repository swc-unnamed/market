<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Login | Unnamed Market</title>
</svelte:head>

<div>
	<div class="flex h-screen items-center justify-center border">
		<div class="flex items-center justify-center p-4">
			<Card.Root class="sm:w-2/3 md:w-1/2">
				<Card.Header>
					<Card.Title>
						<img class="rounded-lg" src="/assets/unnamed-banner.png" alt="Unnamed Market" />
					</Card.Title>
					<Card.Description class="mt-3">
						<h1 class="text-center text-2xl font-bold">Unnamed Imperium Market</h1>
					</Card.Description>
				</Card.Header>
				<Card.Content class="text-center text-muted-foreground">
					<p>
						Welcome to the UIM. You must authenticate with the <a
							href="https://www.swcombine.com"
							target="_blank">Combine</a
						> before you can continue.
					</p>
				</Card.Content>
				<Card.Footer class="flex justify-center">
					<Button class="" variant="link" href={data.url}>Login with SW Combine</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>
</div>
