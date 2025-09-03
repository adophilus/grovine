import { serve } from '@hono/node-server'
import { app, config, logger } from './src'

if (!config.server.port) throw new Error('port not set in MEDIA_SERVER_URL')

serve(
  {
    fetch: app.fetch,
    port: Number.parseInt(config.server.port, 10)
  },
  (info) => {
    logger.info(`App running http://${info.address}:${info.port}`)
  }
)
