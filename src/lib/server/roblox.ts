import {
	ROBLOX_API_OAUTH_CLIENT_ID,
	ROBLOX_API_OAUTH_SECRET,
	ROBLOX_API_URL
} from '$env/static/private';

type RobloxResponse<T> = { success: true; data: T } | { success: false; error: RobloxError };

type RobloxError = {
	status: number;
	error: string;
	error_description: string;
};

export type RobloxJWT = {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	id_token: string;
	scope: string;
};

export async function token(code: string) {
	return await robloxAuthPOST<RobloxJWT>(
		'/oauth/v1/token',
		new URLSearchParams({
			grant_type: 'authorization_code',
			code
		})
	);
}

export async function token_refresh(refresh_token: string) {
	return await robloxAuthPOST<RobloxJWT>(
		'/oauth/v1/token',
		new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token
		})
	);
}

export async function token_introspect(token: string) {
	return await robloxAuthPOST<{
		active: boolean;
		jti?: string;
		iss?: string;
		token_type?: string;
		client_id?: string;
		aud?: string;
		sub?: string;
		scope?: string;
		exp?: number;
		iat?: number;
	}>(
		'/oauth/v1/token/introspect',
		new URLSearchParams({
			token
		})
	);
}

export async function token_revoke(token: string) {
	return await robloxAuthPOST(
		'/oauth/v1/token/revoke',
		new URLSearchParams({
			token
		})
	);
}

export async function user_info(user_access_token: string) {
	let url = new URL('/oauth/v1/userinfo', ROBLOX_API_URL);
	let options: RequestInit = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${user_access_token}`
		}
	};

	return await request<{
		sub: string;
		name: string;
		nickname: string;
		preferred_username: string;
		created_at: number;
		profile: string;
		picture: string;
	}>(url, options);
}

async function robloxAuthPOST<T>(path: string, body?: URLSearchParams): Promise<RobloxResponse<T>> {
	let url = new URL(path, ROBLOX_API_URL);
	let options: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${ROBLOX_API_OAUTH_CLIENT_ID}:${ROBLOX_API_OAUTH_SECRET}`)}`
		}
	};

	if (!!body) {
		options.body = body;
	}

	return await request<T>(url, options);
}

async function request<T>(url: URL, options: RequestInit): Promise<RobloxResponse<T>> {
	try {
		// Perform the fetch request
		const response = await fetch(url, options);

		// Handle non-2xx responses
		if (!response.ok) {
			const errorData: RobloxError = await response.json();
			errorData.status = response.status;
			return { success: false, error: errorData };
		}

		// Handle successful but empty response
		if (!Number(response.headers.get('Content-Length'))) return { success: true, data: {} as T };

		// Handle successful response
		const data: T = await response.json();
		return { success: true, data };
	} catch (error) {
		// Catch network or unexpected errors
		return {
			success: false,
			error: {
				status: 500,
				error: 'network_error',
				error_description: (error as Error).message || 'Unknown error occurred'
			}
		};
	}
}
