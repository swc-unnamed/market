import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { stream, streamText, streamSSE } from 'hono/streaming'

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

let id = 0

app.get('/sse', async (c) => {
	return streamSSE(c, async (stream) => {
		while (true) {
			const message = JSON.stringify({
				data: `Current time is ${new Date().toISOString()}`,
				timestamp: Date.now(),
				listingId: id,
			})
			await stream.writeSSE({
				data: message,
				event: 'time-update',
				id: String(id++),
			})
			await stream.sleep(1000)
		}
	})
})


serve({
	fetch: app.fetch,
	port: 3000
}, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})
