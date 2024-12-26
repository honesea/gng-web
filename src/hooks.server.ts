import { ROBLOX_API_OAUTH_CLIENT_ID, ROBLOX_API_URL } from '$env/static/private';
import { validateToken } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	const origin = event.url.origin;
	const path = event.url.pathname;
	const cookies = event.cookies;

	if (path.startsWith('/app') && !validateToken(cookies)) {
		const state = {
			destination: path
		};

		const params = new URLSearchParams({
			client_id: ROBLOX_API_OAUTH_CLIENT_ID,
			redirect_uri: `${origin}/auth/redirect`,
			scope: 'openid profile',
			response_type: 'code',
			state: JSON.stringify(state)
		});

		return redirect(302, `${ROBLOX_API_URL}/oauth/v1/authorize?${params.toString()}`);
	}

	const response = await resolve(event);
	return response;
}
