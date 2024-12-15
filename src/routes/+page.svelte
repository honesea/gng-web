<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const login = async () => {
		console.log('login');
	};
</script>

<main class="h-screen w-screen">
	<div class="flex h-full w-full items-center justify-center">
		<Button variant="outline" on:click={login}>Login</Button>
	</div>
</main>
