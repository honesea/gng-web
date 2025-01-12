<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';
	import { ChevronDownIcon, ExternalLinkIcon } from 'lucide-svelte';

	let { data, children } = $props();
</script>

{#snippet fallback()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-slate-100"
		>
			<Avatar.Root>
				<Avatar.Fallback>...</Avatar.Fallback>
			</Avatar.Root>
			<ChevronDownIcon />
		</DropdownMenu.Trigger>
	</DropdownMenu.Root>
{/snippet}

<nav class="flex h-16 items-center justify-between border-b border-slate-300 px-6">
	<h3>Guess and Go</h3>
	{#await data.user}
		{@render fallback()}
	{:then user}
		{#if user.success}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-slate-100"
				>
					<Avatar.Root>
						<Avatar.Image src={user.data.picture} alt="player icon" />
						<Avatar.Fallback>...</Avatar.Fallback>
					</Avatar.Root>
					<ChevronDownIcon />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>{user.data.name}</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							on:click={() => window.open(user.data.profile, '_blank')}
							class="flex w-full items-center justify-between"
						>
							<span>My Profile</span>
							<ExternalLinkIcon class="h-4 w-4" />
						</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => goto('/auth/logout')}>Logout</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			{@render fallback()}
		{/if}
	{:catch}
		{@render fallback()}
	{/await}
</nav>

<Separator />

<main class="w-screen">
	{@render children()}
</main>
