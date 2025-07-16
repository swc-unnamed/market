import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { v1Router } from './router.js'

const app = new Hono()


app.route('/v1', v1Router);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://0.0.0.0:${info.port}`)
})
