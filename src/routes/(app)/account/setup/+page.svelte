<script lang="ts">
	import PageWrapper from '$lib/components/layout/page-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Terminal from '$lib/components/ui/terminal';

	let initScriptComplete = $state(false);
	let displayNameInputComplete = $state(false);

	let { data } = $props();
</script>

<PageWrapper title="Account Setup">
	<div class="flex max-w-md flex-col justify-center">
		<Terminal.Root delay={250} useWindow={false} onComplete={() => (initScriptComplete = true)}>
			<Terminal.Loading duration={2475}>
				{#snippet loadingMessage()}
					<span class="font-galbasic text-xs"> Detecting entity language </span>
				{/snippet}
				{#snippet completeMessage()}
					<span class="text-green-500">
						✔ Language detected...changing interface to match user preference
					</span>
				{/snippet}
			</Terminal.Loading>
			<Terminal.Loading delay={2500}>
				{#snippet loadingMessage()}
					Checking authentication protocol...
				{/snippet}
				{#snippet completeMessage()}
					<span class="text-green-500">✔ Authentication protocol verified</span>
				{/snippet}
			</Terminal.Loading>
			<Terminal.Loading delay={4000}>
				{#snippet loadingMessage()}
					Detecting identity...
				{/snippet}
				{#snippet completeMessage()}
					<span class="text-green-500">✔ Identity detected: {data.user.username}</span>
				{/snippet}
			</Terminal.Loading>
			<Terminal.AnimatedSpan delay={5250} class="text-red-500">
				<span>ERR: Profile invalid...</span>
			</Terminal.AnimatedSpan>
		</Terminal.Root>

		{#if initScriptComplete}
			<span>What do you want to be called?</span>
			<Input
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						displayNameInputComplete = true;
						initScriptComplete = false; // Reset for next input
					}
				}}
			/>
		{/if}

		{#if displayNameInputComplete}
			<Terminal.Root useWindow={false}>
				<Terminal.Loading duration={3000}>
					{#snippet loadingMessage()}
						Setting up account...
					{/snippet}
					{#snippet completeMessage()}
						<span class="text-green-500">✔ Account setup complete.</span>
						<span class="text-green-500"
							>Your <a class="underline underline-offset-4" href="/auction-house/dashboard"
								>dashboard</a
							> has been setup</span
						>
					{/snippet}
				</Terminal.Loading>
			</Terminal.Root>
		{/if}
	</div>
</PageWrapper>
