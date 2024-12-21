import { authorize } from '$lib/server/roblox';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const { code } = await request.json();
		const result = await authorize(code);

		if (!result.success) {
			throw error(result.error.status, result.error.error_description);
		}

		return json(result.data, { status: 200 });
	} catch {
		throw error(500, 'Unknown error occurred');
	}
}
