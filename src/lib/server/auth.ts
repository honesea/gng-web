import type { Cookies } from '@sveltejs/kit';
import * as roblox from '$lib/server/roblox';

export const AUTH_COOKIE_NAME = 'gng_auth';

export async function validateToken(cookies: Cookies): Promise<boolean> {
	try {
		const authToken = cookies.get(AUTH_COOKIE_NAME);
		if (!authToken) throw new Error('The auth cookie does not exist');

		const jwt: roblox.RobloxJWT = JSON.parse(atob(authToken));
		const introspect = await roblox.token_introspect(jwt.access_token);
		if (!introspect.success) throw new Error('Failed to introspect token');

		// Attempt token refresh
		if (!introspect.data.active) {
			console.log('refresh token');
			const newToken = await roblox.token_refresh(jwt.refresh_token);
			if (!newToken.success) throw new Error('Failed to refresh token');

			console.log('set cookie');
			console.log(newToken);
			const cookie = btoa(JSON.stringify(newToken));
			cookies.set(AUTH_COOKIE_NAME, cookie, { path: '/' });
		}

		return true;
	} catch (error) {
		console.error(error);
		cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
		return false;
	}
}

export function getAccessToken(cookies: Cookies) {
	try {
		const authToken = cookies.get(AUTH_COOKIE_NAME);
		if (!authToken) throw new Error('The auth cookie does not exist');

		const jwt: roblox.RobloxJWT = JSON.parse(atob(authToken));
		if (!jwt.access_token) throw new Error('Failed to get user access token');

		return jwt.access_token;
	} catch (error) {
		console.error(error);
		return '';
	}
}
