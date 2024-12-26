import type { Cookies } from '@sveltejs/kit';

export function validateToken(cookies: Cookies) {
	const currentToken = cookies.get('auth-token');
	return !!currentToken;
}
