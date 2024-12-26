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

export async function authorize(oauth_code: string) {
	return await robloxPOST<{
		access_token: string;
		token_type: string;
		expires_in: number;
		refresh_token: string;
	}>(
		'/oauth/v1/token',
		new URLSearchParams({
			grant_type: 'authorization_code',
			code: oauth_code
		})
	);
}

async function robloxGET<T>(path: string, params?: URLSearchParams) {
	let url = new URL(path, ROBLOX_API_URL);
	const options: RequestInit = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	if (!!params) {
		url.search = params.toString();
	}

	return await fetch(url, options);
}

async function robloxPOST<T>(path: string, body?: URLSearchParams): Promise<RobloxResponse<T>> {
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

	try {
		// Perform the fetch request
		const response = await fetch(url, options);

		// Handle non-2xx responses
		if (!response.ok) {
			const errorData: RobloxError = await response.json();
			errorData.status = response.status;
			return { success: false, error: errorData };
		}

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
