import { getAccessToken } from '$lib/server/auth';
import * as roblox from '$lib/server/roblox';

export const load = async ({ cookies }) => {
	const userAccessToken = getAccessToken(cookies);

	return {
		user: roblox.user_info(userAccessToken)
	};
};
