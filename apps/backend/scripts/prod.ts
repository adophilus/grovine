import { bootstrap } from '@grovine/backend'
import { serve } from '@hono/node-server'

const { app, logger, config, openTelemetryService } = await bootstrap()
openTelemetryService.initialize()

serve(
  {
    fetch: app.create().fetch,
    port: config.server.port
  },
  (info) => {
    logger.info(`Server is running on http://${info.address}:${info.port}`)
  }
)
