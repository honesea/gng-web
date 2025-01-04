import { AUTH_COOKIE_NAME } from '$lib/server/auth';
import * as roblox from '$lib/server/roblox';
import { error, redirect } from '@sveltejs/kit';

export async function GET({ cookies, url }) {
	const code = url.searchParams.get('code');
	const stateString = url.searchParams.get('state');
	const state = !!stateString ? JSON.parse(stateString) : null;
	const destination = state?.destination;

	if (!code || !destination) {
		throw error(500, 'Invalid OAuth authorization');
	}

	const authToken = await roblox.token(code);

	if (!authToken.success) {
		throw error(authToken.error.status, authToken.error.error_description);
	}

	const cookie = btoa(JSON.stringify(authToken.data));
	cookies.set(AUTH_COOKIE_NAME, cookie, { path: '/' });

	return redirect(303, destination);
}
