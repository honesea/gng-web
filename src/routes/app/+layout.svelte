<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';
	import { ChevronDown } from 'lucide-svelte';

	let { children } = $props();
</script>

<nav class="flex h-16 items-center justify-between border-b border-slate-300 px-6">
	<h3>Guess and Go</h3>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-slate-100"
		>
			<Avatar.Root>
				<Avatar.Image src="https://github.com/shadcn.pngkkk" alt="player icon" />
				<Avatar.Fallback>...</Avatar.Fallback>
			</Avatar.Root>
			<ChevronDown />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Profile</DropdownMenu.Item>
				<DropdownMenu.Item>Billing</DropdownMenu.Item>
				<DropdownMenu.Item>Team</DropdownMenu.Item>
				<DropdownMenu.Item>Subscription</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</nav>

<Separator />

<main class="w-screen">
	{@render children()}
</main>
