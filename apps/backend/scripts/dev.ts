import { serve } from '@hono/node-server'
import { config } from '@grovine/backend'
import { app, appLogger as logger } from '@grovine/backend'

serve(
  {
    fetch: app.fetch,
    port: config.server.port
  },
  (info) => {
    logger.info(`Server is running on https://${info.address}:${info.port}`)
  }
)
