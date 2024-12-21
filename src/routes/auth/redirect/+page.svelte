<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get('code');

		const response = await fetch('/api/auth/refresh', {
			method: 'POST',
			body: JSON.stringify({ code }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const json = await response.json();

		console.log(response);
		console.log(json);
	});
</script>

<main class="h-screen w-screen">
	<div class="flex h-full w-full items-center justify-center">
		<h1>REDIRECTED</h1>
	</div>
</main>
