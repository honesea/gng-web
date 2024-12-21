import { ROBLOX_API_OAUTH_CLIENT_ID, ROBLOX_API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export async function GET() {
	const params = new URLSearchParams({
		client_id: ROBLOX_API_OAUTH_CLIENT_ID,
		redirect_uri: 'http://localhost:5173/auth/redirect',
		scope: 'openid profile',
		response_type: 'code'
	});

	redirect(302, `${ROBLOX_API_URL}/oauth/v1/authorize?${params.toString()}`);
}
