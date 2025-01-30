<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { data } = $props();

	let impersonationDialogOpen = $state(false);
	let impersonationHandle = $state('');
	let impersonationUid = $state('');
	let handlecheckResultText = $state('');
	let impersonationButtonBusy = $state(false);

	let banned = $state(page.url.searchParams.has('banned'));

	async function retrieveHandleInfo(handle: string) {
		impersonationButtonBusy = true;

		const handleCheckResponse = await fetch(`/api/combine/handlecheck?handle=${handle}`, {
			headers: { Accept: 'application/json' }
		});

		if (handleCheckResponse.status === 404) {
			impersonationUid = '';
			handlecheckResultText = 'Handle does not exist. Enter the handle of a real SWC user.';
			impersonationButtonBusy = false;
			return;
		}

		const handleCheck = (await handleCheckResponse.json()) as { handle: string; uid: string };
		if (
			handleCheck.handle.localeCompare(impersonationHandle, undefined, { sensitivity: 'base' }) !==
			0
		) {
			return;
		}

		impersonationUid = handleCheck.uid;
		handlecheckResultText = 'Handle found. This user can be impersonated.';
		impersonationButtonBusy = false;
	}

	async function impersonateUser(handle: string, uid: string) {
		window.location.href = `/callback?dev_handle=${handle}&dev_uid=${uid}`;
	}

	async function onImpersonateButtonClicked() {
		if (!dev) return;
		if (!impersonationUid) return await retrieveHandleInfo(impersonationHandle);
		return await impersonateUser(impersonationHandle, impersonationUid);
	}
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
						<img
							class="mx-auto h-48 w-48 rounded-lg"
							src="/assets/uim-17.png"
							alt="Unnamed Market"
						/>
					</Card.Title>
					<Card.Description class="mt-3">
						<h1 class="text-center text-2xl font-bold">Unnamed Market</h1>
					</Card.Description>
				</Card.Header>
				<Card.Content class="text-center text-muted-foreground">
					<p>
						Welcome to UM. You must authenticate with the <a
							href="https://www.swcombine.com"
							target="_blank">Combine</a
						> before you can continue.
					</p>
				</Card.Content>
				<Card.Footer class="flex flex-col items-center">
					{#if banned}
						<p class="text-red-500">Your account has been banned.</p>
					{:else}
						<Button variant="link" href={data.url}>Login with SW Combine</Button>
					{/if}
					{#if dev}
						<Button
							class="text-muted-foreground"
							variant="link"
							onclick={() => (impersonationDialogOpen = true)}
						>
							Impersonate user (developer option)
						</Button>
					{/if}
				</Card.Footer>
			</Card.Root>
		</div>
	</div>
	{#if dev}
		<Dialog.Root bind:open={impersonationDialogOpen}>
			<Dialog.Content>
				<form>
					<Dialog.Header>
						<Dialog.Title>Impersonate User (dev)</Dialog.Title>
						<Dialog.Description
							>Enter the handle of the user you wish to impersonate.</Dialog.Description
						>
					</Dialog.Header>
					<div class="flex flex-col gap-2 py-4">
						<Input type="text" bind:value={impersonationHandle} />
						<p>{handlecheckResultText}</p>
					</div>
					<Dialog.Footer>
						<Button
							type="submit"
							variant="default"
							disabled={impersonationButtonBusy || !impersonationHandle.length}
							onclick={onImpersonateButtonClicked}
						>
							{#if impersonationButtonBusy}
								Busy...
							{:else if !!impersonationUid}
								Impersonate User
							{:else}
								Retrieve Info
							{/if}
						</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	{/if}
</div>
