import { redirect } from '@sveltejs/kit';
import * as roblox from '$lib/server/roblox';
import { AUTH_COOKIE_NAME } from '$lib/server/auth';

export async function GET({ cookies }) {
	const authToken = cookies.get(AUTH_COOKIE_NAME);

	if (authToken) {
		const jwt: roblox.RobloxJWT = JSON.parse(atob(authToken));
		await roblox.token_revoke(jwt.refresh_token);
	}

	cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
	return redirect(303, '/');
}
