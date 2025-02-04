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
	<div class="relative flex h-screen w-full items-center justify-center bg-cover bg-center">
		<!-- Background Image -->
		<div
			class="absolute inset-0 bg-[url('/images/login/banner-1.png')] bg-cover bg-center"
			style="mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 90%);
-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 90%);
"
		></div>

		<!-- Gradient Overlay to Create the Fade Effect -->
		<div
			class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"
		></div>

		<!-- Login Card -->
		<div class="relative z-10 rounded-xl">
			<div class="flex flex-col items-center justify-center">
				<img class="mx-auto h-48 w-48 rounded-lg" src="/assets/uim-17.png" alt="Unnamed Market" />
				<h1 class="text-center text-2xl font-bold tracking-wider">Unnamed Market</h1>
				<span class="text-primary">Your gateway to the holochain </span>
			</div>
			<div class="flex items-center justify-center p-4">
				<Card.Root class="sm:w-2/3 md:w-3/4">
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
							<Button variant="action" href={data.url}>Login with SW Combine</Button>

							<p class="text-xs">New? Scroll down to see the platform features.</p>
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
	</div>

	<div class="mx-auto flex w-1/2 flex-col justify-start">
		<h1>Platform Features</h1>
		<div class="grid grid-cols-2 gap-4">
			<div class="grid grid-cols-1 gap-2">
				<Card.Root>
					<Card.Header>
						<Card.Title>Seamless Integration</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Market Data</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Entity Ledger</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>All Encompassing Market</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>User Feedback</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>
			</div>

			<div class="grid grid-cols-1 gap-2">
				<Card.Root>
					<Card.Header>
						<Card.Title>Automated Discord Notifications</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Intuitive Modern UI</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Draft Listings</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Watchlisting</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Real-time Auctions</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>
			</div>
		</div>
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
