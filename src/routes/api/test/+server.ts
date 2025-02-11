import { db } from '$lib/server/db';
import { produce } from 'sveltekit-sse';
import Redis from 'ioredis';
import { json } from '@sveltejs/kit';

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function POST() {
	const redisClient = new Redis('redis://localhost:6379');

	redisClient.set('test', 'test');

	return produce(async function start({ emit }) {
		while (true) {
			const data = await redisClient.get('test');

			redisClient.subscribe;

			if (data) {
				const { error } = emit('message', JSON.stringify(data));

				if (error) {
					return;
				}
			}

			await delay(1000);
		}
	});
}

export function GET() {
	const redisClient = new Redis('redis://localhost:6379');

	redisClient.set('test', 'this is an update!');

	return json({ message: 'Hello world!' });
}
