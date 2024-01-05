import app from "./src/app";
import { serve } from '@hono/node-server'

serve({
  fetch: app.fetch,
  port: process.env.PORT || 5000,
}, (addr) => {
  console.log("Server running on port:", addr.port)
})
