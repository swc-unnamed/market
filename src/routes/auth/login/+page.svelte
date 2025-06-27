<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import Icon from '@iconify/svelte';

	let { data } = $props();

	let impersonationDialogOpen = $state(false);
	let impersonationHandle = $state('');
	let impersonationUid = $state('');
	let handlecheckResultText = $state('');
	let impersonationButtonBusy = $state(false);

	let banned = $state(page.url.searchParams.has('banned'));

	const isOauthError = $state(page.url.searchParams.has('error', 'oauth_error'));

	const isBetaErrorMessage = $state(page.url.searchParams.has('error', 'beta_access_required'));

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

		const handleCheck = (await handleCheckResponse.json()) as {
			handle: string;
			uid: string;
		};
		if (
			handleCheck.handle.localeCompare(impersonationHandle, undefined, {
				sensitivity: 'base'
			}) !== 0
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
			style="mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, 0) 90%);
-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, 0) 90%);
"
		></div>

		<!-- Gradient Overlay to Create the Fade Effect -->
		<div
			class="to-background absolute inset-0 bg-gradient-to-b from-transparent via-transparent"
		></div>

		<!-- Login Card -->
		<div class="relative z-10 rounded-xl">
			<div class=" flex flex-col items-center justify-center">
				<img class="mx-auto h-40 w-40 rounded-lg" src="/images/uim-17.png" alt="Unnamed Market" />
				<h1 class="text-center text-6xl font-bold tracking-wider">Unnamed Market</h1>
				<span class="text-primary text-2xl">Your gateway to the holochain</span>
			</div>
			<div class="mt-12 flex flex-col items-center justify-center gap-3 p-4">
				{#if isOauthError}
					<Alert.Root class="border-red-500">
						<Alert.Description>
							<p class="text-center">
								There was an error with the authentication process. Please try again.
							</p>
						</Alert.Description>
					</Alert.Root>
				{:else if isBetaErrorMessage}
					<Alert.Root class="border-red-500">
						<Alert.Description>
							<p class="text-center">You have not been granted access to this beta.</p>
						</Alert.Description>
					</Alert.Root>
				{:else if banned}
					<Alert.Root class="border-red-500">
						<Alert.Description class="text-center"
							>You have been banned from the platform.</Alert.Description
						>
					</Alert.Root>
				{/if}

				<Card.Root class="w-full">
					<Card.Content class="text-muted-foreground text-center">
						<p>You must authenticate with the Combine before you can continue.</p>
					</Card.Content>
					<Card.Footer class="flex flex-col items-center">
						{#if !banned}
							<Button class="mb-3" href={data.url}>Login with SW Combine</Button>
						{/if}
						{#if dev}
							<Button
								class="text-muted-foreground"
								variant="link"
								onclick={() => (impersonationDialogOpen = true)}
								>Impersonate user (developer option)</Button
							>
						{/if}

						<span class="text-muted-foreground text-xs">
							By continuing, you agree to our <a href="/privacy-tou"
								>Privacy Policy and Terms of Use</a
							>
						</span>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>
	</div>

	<!-- Platform Features-->
	<div class="mx-auto flex w-full flex-col justify-start p-4 md:w-2/3 md:p-0">
		<h1 class="mb-2">Platform Features</h1>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="grid grid-cols-1 gap-2">
				<Card.Root>
					<Card.Content class="space-y-3">
						<div class="flex items-center gap-1">
							<div class="w-24 p-3">
								<Icon icon="tabler:database" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Seemless Integration</h2>
								<p class="text-sm">Our API allows the platform to synchronize with SWCombine.</p>
							</div>
						</div>

						<Separator />

						<div class="flex items-center gap-1">
							<div class="w-24 p-3">
								<Icon icon="tabler:trending-up" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Market Data</h2>
								<p class="text-sm">
									Entity sales provides data to better inform your profiting decisions.
								</p>
							</div>
						</div>

						<Separator />

						<div class="flex items-center gap-1">
							<div class="w-24 p-3">
								<Icon icon="tabler:packages" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Entity Ledger</h2>
								<p class="text-sm">
									Entity IDs are tracked in-order to prevent malicious price manipulation.
								</p>
							</div>
						</div>

						<Separator />

						<div class="flex items-center gap-1">
							<div class="w-28 p-3">
								<Icon icon="tabler:chart-arcs" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>All Encompassing Market</h2>
								<p class="text-sm">
									Live auctions by Unnamed Market, auctions, buying, and selling is possible on the
									platform.
								</p>
							</div>
						</div>

						<Separator />

						<div class="flex gap-1">
							<div class="w-28 p-3">
								<Icon icon="tabler:thumb-up" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>User Feedback</h2>
								<p class="text-sm">
									You are able to leave feedback for each transaction you make, ensuring everyone is
									trustworthy.
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<div class="grid grid-cols-1 gap-2">
				<Card.Root>
					<Card.Content class="space-y-3">
						<div class="flex items-center gap-1">
							<div class="w-24 p-3">
								<Icon icon="tabler:building-broadcast-tower" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Custom Discord Notifications</h2>
								<p class="text-sm">New listings automatically notify you upon their creation.</p>
							</div>
						</div>

						<Separator />

						<div class="flex items-center gap-1">
							<div class="w-24 p-3">
								<Icon icon="tabler:brand-trello" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Intuitive Modern UI</h2>
								<p class="text-sm">
									The platform is streamlined to be simple, load fast, and be intuitive.
								</p>
							</div>
						</div>

						<Separator />

						<div class="flex items-center gap-1">
							<div class="w-32 p-3">
								<Icon icon="tabler:clock-24" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Draft Listings</h2>
								<p class="text-sm">
									Want to start a listing, but are unsure of the details? You can save it as a draft
									listing and publish it later!
								</p>
							</div>
						</div>

						<Separator />

						<div class="flex items-center gap-1">
							<div class="w-32 p-3">
								<Icon icon="tabler:mail-opened" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Discord Notifications</h2>
								<p class="text-sm">
									Unnamed Market's Discord Bot notifies you when your listing is sold or you've
									successfully bought one.
								</p>
							</div>
						</div>

						<Separator />

						<div class="flex items-center gap-1">
							<div class="w-24 p-3">
								<Icon icon="tabler:analyze-filled" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Watchlisting</h2>
								<p class="text-sm">
									Add listings to your watch-list where you are notified of any changes.
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>

	<img
		class="mx-auto w-full rounded-lg opacity-30 md:w-2/3"
		src="/images/login/banner-2.png"
		alt="Unnamed Market"
	/>

	<div class="mx-auto mb-6 flex w-full flex-col justify-start p-4 md:w-2/3 md:p-0">
		<div class="mb-2 flex flex-col gap-0">
			<h1>SWCombine Integration</h1>
			<p class="text-primary">
				By synchronizing with SWCombine we are able to have some advantages over other market
				platforms.
			</p>
		</div>
		<div class="grid grid-cols-1 gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm"
						>Complete SWCombine synchronization is optional & reads the following information:</Card.Title
					>
				</Card.Header>
				<Card.Content class="space-y-3">
					<div class="flex gap-1">
						<div class="w-20">
							<Icon icon="tabler:brand-codesandbox" class="size-12" />
						</div>
						<div class="col-span-2">
							<p>Surface Synchronization</p>
							<p>
								Reads basic information such as ID, handle, faction, and avatar. This is required
								for authentication purposes.
							</p>
						</div>
					</div>

					<Separator />

					<div class="flex gap-1">
						<div class="w-20">
							<Icon icon="tabler:package" class="size-12" />
						</div>
						<div class="col-span-2">
							<p>Full Synchronization</p>
							<p>
								Reads everything a surface synchronization does but with additional points of data
								such as entity ID, entity image, entity location.
							</p>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>

	<div class="mx-auto mb-6 flex w-full flex-col justify-start p-4 md:w-2/3 md:p-0">
		<div class="flex flex-col gap-0">
			<h1>Integration Security</h1>
			<span class="text-primary"
				>We ensure the platform is safe and secure to integrate without risks.</span
			>
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="grid grid-cols-1 gap-2">
				<Card.Root>
					<Card.Content class="space-y-3">
						<div class="flex items-center gap-1">
							<div class="w-24 p-3">
								<Icon icon="tabler:lock-check" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Data Storage</h2>
								<p class="text-sm">
									We do not store any data that is read through integration with the platform.
								</p>
							</div>
						</div>

						<Separator />

						<div class="flex items-center gap-1">
							<div class="w-24 p-3">
								<Icon icon="tabler:align-justified" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Optional Full Integration</h2>
								<p class="text-sm">
									Full integration is always optional and you will not be bothered to enable it.
								</p>
							</div>
						</div>

						<Separator />

						<div class="flex items-center gap-1">
							<div class="w-24 p-3">
								<Icon icon="tabler:cloud-lock" class="size-12" />
							</div>
							<div class="col-span-2 space-y-1">
								<h2>Encryption</h2>
								<p class="text-sm">
									Data that is processed through the API is encrypted to make it difficult to read
									through a third party.
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<div class="relative w-fit">
				<img src="/images/login/cargo.png" alt="cargo" class="opacity-50" />
				<div
					class="absolute inset-0 bg-gradient-to-r from-transparent via-black/0 to-black/0"
				></div>
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
