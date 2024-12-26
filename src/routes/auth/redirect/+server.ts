import { authorize } from '$lib/server/roblox';
import { error, redirect } from '@sveltejs/kit';

export async function GET({ cookies, url }) {
	const code = url.searchParams.get('code');
	const stateString = url.searchParams.get('state');
	const state = !!stateString ? JSON.parse(stateString) : null;
	const destination = state?.destination;

	if (!code || !destination) {
		throw error(500, 'Invalid OAuth authorization');
	}

	const authToken = await authorize(code);

	if (!authToken.success) {
		throw error(authToken.error.status, authToken.error.error_description);
	}

	const cookie = JSON.stringify(authToken.data);
	cookies.set('auth-token', cookie, { path: '/' });

	return redirect(303, destination);
}
