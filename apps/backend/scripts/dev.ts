import { serve } from '@hono/node-server'
import { bootstrap } from '@grovine/backend'

const { app, logger, config } = bootstrap()

serve(
  {
    fetch: app.create().fetch,
    port: config.server.port
  },
  (info) => {
    logger.info(`Server is running on http://${info.address}:${info.port}`)
  }
)
