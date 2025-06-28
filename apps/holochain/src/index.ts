import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { stream, streamText, streamSSE } from 'hono/streaming'

const app = new Hono()

app.get('/', (c) => {
	return c.json({
		message: 'Hello'
	})
})


serve({
	fetch: app.fetch,
	port: 3000
}, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})
